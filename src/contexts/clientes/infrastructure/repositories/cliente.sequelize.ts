import { ClienteEntity } from '../../core/entities/cliente.entity';
import { ClienteRepository } from '../../core/repository/cliente.repository';
import { ClienteModel } from '@src/contexts/shared/infrastructure/models/trade/cliente.model';

export class ClienteSequelizeRepository implements ClienteRepository {
  async getAll(limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await ClienteModel.findAndCountAll({
      offset,
      limit,
      order: [['nombre', 'ASC']]
    });
    return {
      data: rows.map(r => ClienteEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async getById(id: number): Promise<ClienteEntity | null> {
    const row = await ClienteModel.findByPk(id);
    if (!row) return null;
    return ClienteEntity.fromPrimitives(row.get({ plain: true }));
  }
}
