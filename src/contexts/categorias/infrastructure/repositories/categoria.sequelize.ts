import { CategoriaEntity } from '../../core/entities/categoria.entity';
import { CategoriaRepository } from '../../core/repository/categoria.repository';
import { CategoriaModel } from '@src/contexts/shared/infrastructure/models/trade/categoria.model';

export class CategoriaSequelizeRepository implements CategoriaRepository {
  async getAll(): Promise<CategoriaEntity[]> {
    const rows = await CategoriaModel.findAll({ order: [['nombre', 'ASC']] });
    return rows.map(r => CategoriaEntity.fromPrimitives(r.get({ plain: true })));
  }

  async create(data: { nombre: string; descripcion?: string; color?: string }): Promise<CategoriaEntity> {
    const row = await CategoriaModel.create({ ...data, activo: true } as any);
    return CategoriaEntity.fromPrimitives(row.get({ plain: true }));
  }

  async update(
    id: number,
    data: Partial<{ nombre: string; descripcion: string | null; color: string | null; activo: boolean }>
  ): Promise<CategoriaEntity | null> {
    const row = await CategoriaModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return CategoriaEntity.fromPrimitives(row.get({ plain: true }));
  }

  async delete(id: number): Promise<boolean> {
    const row = await CategoriaModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  }
}
