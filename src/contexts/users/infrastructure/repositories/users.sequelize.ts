import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';

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
}
