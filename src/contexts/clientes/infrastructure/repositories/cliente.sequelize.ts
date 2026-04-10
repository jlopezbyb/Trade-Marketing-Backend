import { ClienteEntity } from '../../core/entities/cliente.entity';
import { ClienteRepository } from '../../core/repository/cliente.repository';
import { ClienteModel } from '@src/contexts/shared/infrastructure/models/trade/cliente.model';
import { UsuarioClienteModel } from '@src/contexts/shared/infrastructure/models/trade/usuario-cliente.model';

export class ClienteSequelizeRepository implements ClienteRepository {
  async getAll(limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await ClienteModel.findAndCountAll({
      where: { activo: true },
      offset,
      limit,
      order: [['nombre', 'ASC']]
    });
    return {
      data: rows.map(r => ClienteEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }

  async getById(id: string): Promise<ClienteEntity | null> {
    const row = await ClienteModel.findOne({ where: { id, activo: true } });
    if (!row) return null;
    return ClienteEntity.fromPrimitives(row.get({ plain: true }));
  }

  async create(data: {
    nombre: string;
    cliente_code: string;
    direccion: string;
    telefono: string;
    contacto: string;
    email?: string;
    imagen_url?: string;
  }): Promise<ClienteEntity> {
    const row = await ClienteModel.create({ ...data, activo: true } as any);
    return ClienteEntity.fromPrimitives(row.get({ plain: true }));
  }

  async update(
    id: string,
    data: Partial<{
      nombre: string;
      cliente_code: string;
      direccion: string;
      telefono: string;
      contacto: string;
      email: string | null;
      imagen_url: string | null;
      activo: boolean;
    }>
  ): Promise<ClienteEntity | null> {
    const row = await ClienteModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return ClienteEntity.fromPrimitives(row.get({ plain: true }));
  }

  async delete(id: string): Promise<boolean> {
    const row = await ClienteModel.findByPk(id);
    if (!row) return false;
    await row.update({ activo: false });
    return true;
  }

  async getByUsuarioId(usuarioId: string, limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const asignados = await UsuarioClienteModel.findAll({ where: { usuario_id: usuarioId }, attributes: ['cliente_id'] });
    const ids = asignados.map(r => (r.get({ plain: true }) as { cliente_id: string }).cliente_id);
    if (ids.length === 0) return { data: [], total: 0 };
    const { count, rows } = await ClienteModel.findAndCountAll({
      where: { id: ids, activo: true },
      offset,
      limit,
      order: [['nombre', 'ASC']]
    });
    return {
      data: rows.map(r => ClienteEntity.fromPrimitives(r.get({ plain: true }))),
      total: count
    };
  }
}
