import { sequelize } from '@src/server/config/database/sequelize';
import { QueryTypes } from 'sequelize';

export const REPORTES_DASHBOARD_DEFAULTS = {
  inventarioEstancadoDias: 14,
  productosPorVencerDias: 30
} as const;

type CountRow = {
  total: string | number;
};

type SummaryRow = {
  totalClientes: string | number;
  totalProductos: string | number;
  totalInventario: string | number;
  productosPorVencer: string | number;
  productosEstancados: string | number;
  visitasHoy: string | number;
  visitasSemana: string | number;
};

export class ReportesSequelizeRepository {
  async getInventarioEstancado(
    limit: number,
    page: number,
    diasSinMovimiento: number = REPORTES_DASHBOARD_DEFAULTS.inventarioEstancadoDias
  ) {
    const offset = (page - 1) * limit;
    const [countResult] = await sequelize.query<CountRow>(
      'SELECT COUNT(*) as total FROM vw_inventario_estancado WHERE dias_sin_cambio >= :diasSinMovimiento',
      {
        replacements: { diasSinMovimiento },
        type: QueryTypes.SELECT
      }
    );
    const data = await sequelize.query(
      `SELECT
        id,
        cliente_id,
        cliente_nombre,
        producto_id,
        producto_nombre,
        cantidad,
        fecha_actualizacion,
        dias_sin_cambio,
        dias_sin_cambio AS dias_sin_movimiento
      FROM vw_inventario_estancado
      WHERE dias_sin_cambio >= :diasSinMovimiento
      ORDER BY dias_sin_cambio DESC, id DESC
      LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit, offset, diasSinMovimiento },
        type: QueryTypes.SELECT
      }
    );
    return { data, total: Number(countResult?.total ?? 0) };
  }

  async getProductosPorVencer(
    limit: number,
    page: number,
    diasParaVencer: number = REPORTES_DASHBOARD_DEFAULTS.productosPorVencerDias
  ) {
    const offset = (page - 1) * limit;
    const [countResult] = await sequelize.query<CountRow>(
      `SELECT COUNT(*) as total
      FROM vw_productos_por_vencer
      WHERE dias_para_vencer BETWEEN 0 AND :diasParaVencer`,
      {
        replacements: { diasParaVencer },
        type: QueryTypes.SELECT
      }
    );
    const data = await sequelize.query(
      `SELECT *
      FROM vw_productos_por_vencer
      WHERE dias_para_vencer BETWEEN 0 AND :diasParaVencer
      ORDER BY dias_para_vencer ASC, id ASC
      LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit, offset, diasParaVencer },
        type: QueryTypes.SELECT
      }
    );
    return { data, total: Number(countResult?.total ?? 0) };
  }

  async getSummary() {
    const [summary] = await sequelize.query<SummaryRow>(
      `SELECT
        (SELECT COUNT(*) FROM clientes WHERE activo = true) AS "totalClientes",
        (SELECT COUNT(*) FROM productos WHERE activo = true) AS "totalProductos",
        (SELECT COALESCE(SUM(cantidad), 0) FROM inventario) AS "totalInventario",
        (
          SELECT COUNT(*)
          FROM inventario_lotes
          WHERE fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + CAST(:productosPorVencerDias AS INTEGER)
        ) AS "productosPorVencer",
        (
          SELECT COUNT(*)
          FROM inventario
          WHERE (CURRENT_DATE - fecha_actualizacion) >= :inventarioEstancadoDias
        ) AS "productosEstancados",
        (
          SELECT COUNT(*)
          FROM visitas
          WHERE fecha = CURRENT_DATE
        ) AS "visitasHoy",
        (
          SELECT COUNT(*)
          FROM visitas
          WHERE fecha >= DATE_TRUNC('week', CURRENT_DATE)::date
        ) AS "visitasSemana"`,
      {
        replacements: {
          inventarioEstancadoDias: REPORTES_DASHBOARD_DEFAULTS.inventarioEstancadoDias,
          productosPorVencerDias: REPORTES_DASHBOARD_DEFAULTS.productosPorVencerDias
        },
        type: QueryTypes.SELECT
      }
    );

    return {
      totalClientes: Number(summary?.totalClientes ?? 0),
      totalProductos: Number(summary?.totalProductos ?? 0),
      totalInventario: Number(summary?.totalInventario ?? 0),
      productosPorVencer: Number(summary?.productosPorVencer ?? 0),
      productosEstancados: Number(summary?.productosEstancados ?? 0),
      visitasHoy: Number(summary?.visitasHoy ?? 0),
      visitasSemana: Number(summary?.visitasSemana ?? 0)
    };
  }
}
