import { VisitaEntity } from '../../core/entities/visita.entity';
import { VisitaRepository } from '../../core/repository/visita.repository';
import { VisitaModel } from '@src/contexts/shared/infrastructure/models/trade/visita.model';
import { ClienteModel } from '@src/contexts/shared/infrastructure/models/trade/cliente.model';
import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';

export class VisitaSequelizeRepository implements VisitaRepository {
  async getAll(limit: number, page: number): Promise<{ data: VisitaEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await VisitaModel.findAndCountAll({
      offset,
      limit,
      include: [
        { model: ClienteModel, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: UserModel, as: 'usuario', attributes: ['id', 'nombre'] }
      ],
      order: [
        ['fecha', 'DESC'],
        ['created_at', 'DESC'],
        ['id', 'DESC']
      ]
    });
    return {
      data: rows.map(r => VisitaEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async create(data: { cliente_id: string; usuario_id: string; fecha: string; observaciones?: string }): Promise<VisitaEntity> {
    const row = await VisitaModel.create(data as any);
    return VisitaEntity.fromPrimitives(row.get({ plain: true }));
  }

  async update(
    id: string,
    data: Partial<{ cliente_id: string; usuario_id: string; fecha: string; observaciones: string | null }>
  ): Promise<VisitaEntity | null> {
    const row = await VisitaModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return VisitaEntity.fromPrimitives(row.get({ plain: true }));
  }

  async delete(id: string): Promise<boolean> {
    const row = await VisitaModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  }
}
