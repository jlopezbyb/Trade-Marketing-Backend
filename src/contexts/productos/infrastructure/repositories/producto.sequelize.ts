import { ProductoEntity } from '../../core/entities/producto.entity';
import { ProductoRepository } from '../../core/repository/producto.repository';
import { ProductoModel } from '@src/contexts/shared/infrastructure/models/trade/producto.model';
import { CategoriaModel } from '@src/contexts/shared/infrastructure/models/trade/categoria.model';

export class ProductoSequelizeRepository implements ProductoRepository {
  async getAll(limit: number, page: number): Promise<{ data: ProductoEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await ProductoModel.findAndCountAll({
      offset,
      limit,
      include: [{ model: CategoriaModel, as: 'categoria', attributes: ['id', 'nombre', 'color'] }],
      order: [['nombre', 'ASC']]
    });
    return {
      data: rows.map(r => ProductoEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async create(data: {
    nombre: string;
    sku: string;
    unidad: string;
    categoria_id: string;
    imagen_url?: string;
  }): Promise<ProductoEntity> {
    const row = await ProductoModel.create({ ...data, activo: true } as any);
    return ProductoEntity.fromPrimitives(row.get({ plain: true }));
  }

  async update(
    id: string,
    data: Partial<{
      nombre: string;
      sku: string;
      unidad: string;
      categoria_id: string;
      imagen_url: string | null;
      activo: boolean;
    }>
  ): Promise<ProductoEntity | null> {
    const row = await ProductoModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return ProductoEntity.fromPrimitives(row.get({ plain: true }));
  }

  async delete(id: string): Promise<boolean> {
    const row = await ProductoModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  }
}
