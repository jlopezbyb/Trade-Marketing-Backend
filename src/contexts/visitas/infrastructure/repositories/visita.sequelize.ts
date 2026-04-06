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
        ['id', 'DESC']
      ]
    });
    return {
      data: rows.map(r => VisitaEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async create(data: { cliente_id: number; usuario_id: number; fecha: string; observaciones?: string }): Promise<VisitaEntity> {
    const row = await VisitaModel.create(data as any);
    return VisitaEntity.fromPrimitives(row.get({ plain: true }));
  }
}
