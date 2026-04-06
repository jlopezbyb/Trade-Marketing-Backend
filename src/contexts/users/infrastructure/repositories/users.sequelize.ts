import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { UsuarioClienteModel } from '@src/contexts/shared/infrastructure/models/trade/usuario-cliente.model';
import { ClienteModel } from '@src/contexts/shared/infrastructure/models/trade/cliente.model';

export interface UsersListItem {
  id: number;
  email: string;
  employee_code: string;
  nombre: string;
  rol: string;
  activo: boolean;
  imagen_url: string | null;
}

export class UsersSequelizeRepository {
  async getAll(limit: number, page: number): Promise<{ data: UsersListItem[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await UserModel.findAndCountAll({
      offset,
      limit,
      order: [['nombre', 'ASC']]
    });
    return {
      data: rows.map(r => r.get({ plain: true }) as UsersListItem),
      total: count
    };
  }

  async getById(id: number): Promise<UsersListItem | null> {
    const row = await UserModel.findByPk(id);
    if (!row) return null;
    return row.get({ plain: true }) as UsersListItem;
  }

  async create(data: {
    email: string;
    employee_code: string;
    nombre: string;
    rol: string;
    imagen_url?: string;
  }): Promise<UsersListItem> {
    const row = await UserModel.create({ ...data, activo: true } as any);
    return row.get({ plain: true }) as UsersListItem;
  }

  async update(
    id: number,
    data: Partial<{
      email: string;
      employee_code: string;
      nombre: string;
      rol: string;
      activo: boolean;
      imagen_url: string | null;
    }>
  ): Promise<UsersListItem | null> {
    const row = await UserModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return row.get({ plain: true }) as UsersListItem;
  }

  async delete(id: number): Promise<boolean> {
    const row = await UserModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  }

  // --- Asignación de clientes ---
  async getClientesAsignados(usuarioId: number) {
    const rows = await UsuarioClienteModel.findAll({
      where: { usuario_id: usuarioId },
      include: [{ model: ClienteModel, attributes: ['id', 'nombre', 'cliente_code', 'direccion', 'telefono', 'contacto'] }]
    });
    return rows.map(r => {
      const plain = r.get({ plain: true }) as { cliente?: Record<string, unknown> };
      return plain.cliente ?? plain;
    });
  }

  async asignarClientes(usuarioId: number, clienteIds: number[]) {
    await UsuarioClienteModel.destroy({ where: { usuario_id: usuarioId } });
    if (clienteIds.length === 0) return [];
    await UsuarioClienteModel.bulkCreate(clienteIds.map(cliente_id => ({ usuario_id: usuarioId, cliente_id })));
    return this.getClientesAsignados(usuarioId);
  }
}
