import axios from 'axios';
import { Op } from 'sequelize';
import { config } from '@src/server/config/env/envs';
import { ProductoModel } from '@src/contexts/shared/infrastructure/models/trade/producto.model';
import { sequelize } from '@src/server/config/database/sequelize';

interface NavProducto {
  No: string;
  Description?: string;
  Base_Unit_of_Measure?: string;
  Sales_Unit_of_Measure?: string;
  Blocked?: boolean;
}

interface NavProductosResponse {
  value: NavProducto[];
}

const truncate = (value: string | undefined, max: number, fallback: string): string => {
  const base = (value ?? '').trim();
  if (!base) return fallback.slice(0, max);
  return base.length > max ? base.slice(0, max) : base;
};

export const syncProductosFromNav = async () => {
  const navConfig = config.NAV_PRODUCTS;

  if (!navConfig.URL || !navConfig.USERNAME || !navConfig.PASSWORD) {
    console.warn('[NAV Productos] Configuración incompleta; omitiendo sincronización.');
    return;
  }

  console.log('[NAV Productos] Iniciando sincronización de productos desde NAV...');

  try {
    const response = await axios.get<NavProductosResponse>(navConfig.URL, {
      auth: {
        username: navConfig.USERNAME,
        password: navConfig.PASSWORD
      },
      timeout: 60000
    });

    const navItems = response.data?.value ?? [];

    if (!Array.isArray(navItems) || navItems.length === 0) {
      console.log('[NAV Productos] No se recibieron productos desde NAV.');
      return;
    }

    const normalized = navItems
      .map(item => {
        const sku = truncate(item.No, 30, '');
        if (!sku) return null;

        const nombre = truncate(item.Description || item.No, 150, sku);
        const unidad = truncate(item.Sales_Unit_of_Measure || item.Base_Unit_of_Measure || 'UNI', 20, 'UNI');

        return {
          sku,
          nombre,
          unidad,
          blocked: Boolean(item.Blocked)
        };
      })
      .filter((x): x is { sku: string; nombre: string; unidad: string; blocked: boolean } => x !== null);

    if (!normalized.length) {
      console.log('[NAV Productos] Después de normalizar, no hay productos válidos para procesar.');
      return;
    }

    const skus = normalized.map(p => p.sku);

    const transaction = await sequelize.transaction();

    try {
      const existing = await ProductoModel.findAll({ where: { sku: { [Op.in]: skus } }, transaction });
      const existingBySku = new Map<string, (typeof existing)[number]>();

      for (const row of existing) {
        existingBySku.set(row.getDataValue('sku'), row);
      }

      const defaultCategoryId = navConfig.DEFAULT_CATEGORY_ID ?? null;

      let createdCount = 0;
      let updatedCount = 0;

      for (const item of normalized) {
        const current = existingBySku.get(item.sku);

        if (current) {
          await current.update(
            {
              nombre: item.nombre,
              unidad: item.unidad,
              activo: !item.blocked
            },
            { transaction }
          );
          updatedCount += 1;
        } else {
          await ProductoModel.create(
            {
              nombre: item.nombre,
              sku: item.sku,
              unidad: item.unidad,
              categoria_id: defaultCategoryId,
              imagen_url: null,
              activo: !item.blocked
            } as any,
            { transaction }
          );
          createdCount += 1;
        }
      }

      await transaction.commit();

      console.log(
        `[NAV Productos] Sincronización completada. Nuevos: ${createdCount}, Actualizados: ${updatedCount}, Total NAV: ${normalized.length}`
      );
    } catch (error) {
      await transaction.rollback();
      console.error('[NAV Productos] Error durante la sincronización, se hizo rollback.', error);
      throw error;
    }
  } catch (error) {
    console.error('[NAV Productos] Error al llamar al servicio NAV.', error);
  }
};
