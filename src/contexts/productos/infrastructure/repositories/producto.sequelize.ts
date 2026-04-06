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
}
