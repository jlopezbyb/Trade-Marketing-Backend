import { CategoriaEntity } from '../../core/entities/categoria.entity';
import { CategoriaRepository } from '../../core/repository/categoria.repository';
import { CategoriaModel } from '@src/contexts/shared/infrastructure/models/trade/categoria.model';

export class CategoriaSequelizeRepository implements CategoriaRepository {
  async getAll(): Promise<CategoriaEntity[]> {
    const rows = await CategoriaModel.findAll({ order: [['nombre', 'ASC']] });
    return rows.map(r => CategoriaEntity.fromPrimitives(r.get({ plain: true })));
  }
}
