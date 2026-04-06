import { InventarioEntity } from '../../core/entities/inventario.entity';
import { InventarioRepository, InventarioItem } from '../../core/repository/inventario.repository';
import { InventarioModel } from '@src/contexts/shared/infrastructure/models/trade/inventario.model';
import { InventarioLoteModel } from '@src/contexts/shared/infrastructure/models/trade/inventario-lote.model';
import { ClienteModel } from '@src/contexts/shared/infrastructure/models/trade/cliente.model';
import { ProductoModel } from '@src/contexts/shared/infrastructure/models/trade/producto.model';
import { sequelize } from '@src/server/config/database/sequelize';

export class InventarioSequelizeRepository implements InventarioRepository {
  async getAll(limit: number, page: number): Promise<{ data: InventarioEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await InventarioModel.findAndCountAll({
      offset,
      limit,
      include: [
        { model: ClienteModel, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: ProductoModel, as: 'producto', attributes: ['id', 'nombre', 'sku'] }
      ],
      order: [
        ['fecha_actualizacion', 'DESC'],
        ['id', 'DESC']
      ]
    });
    return {
      data: rows.map(r => InventarioEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async createBulk(cliente_id: number, fecha: string, items: InventarioItem[]): Promise<InventarioEntity[]> {
    const t = await sequelize.transaction();
    try {
      const created: InventarioEntity[] = [];
      for (const item of items) {
        const inv = await InventarioModel.create(
          { cliente_id, producto_id: item.producto_id, cantidad: item.cantidad, fecha_actualizacion: fecha } as any,
          { transaction: t }
        );
        const plain = inv.get({ plain: true });

        if (item.lotes?.length) {
          await InventarioLoteModel.bulkCreate(
            item.lotes.map(l => ({
              inventario_id: plain.id,
              lote: l.lote,
              cantidad: l.cantidad,
              fecha_vencimiento: l.fecha_vencimiento
            })),
            { transaction: t }
          );
        }
        created.push(InventarioEntity.fromPrimitives(plain));
      }
      await t.commit();
      return created;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(
    id: number,
    data: Partial<{ cliente_id: number; producto_id: number; cantidad: number; fecha_actualizacion: string }>
  ): Promise<InventarioEntity | null> {
    const row = await InventarioModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return InventarioEntity.fromPrimitives(row.get({ plain: true }));
  }

  async delete(id: number): Promise<boolean> {
    const t = await sequelize.transaction();
    try {
      const row = await InventarioModel.findByPk(id, { transaction: t });
      if (!row) {
        await t.rollback();
        return false;
      }
      await InventarioLoteModel.destroy({ where: { inventario_id: id }, transaction: t });
      await row.destroy({ transaction: t });
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
