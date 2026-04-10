import { UserEntity, UserRol } from '@src/contexts/auth/core/entities/user-entity';
import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';

import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';

export class MySQLSequelizeUserRepository implements UserRepository {
  async create(user: { email: string; employee_code: string; nombre: string; rol: UserRol }): Promise<void> {
    await UserModel.create(user);
  }

  async update(user: {
    id: string;
    email: string;
    employee_code: string;
    nombre: string;
    rol: UserRol;
    activo: boolean;
  }): Promise<void> {
    await UserModel.update(
      {
        email: user.email,
        employee_code: user.employee_code,
        nombre: user.nombre,
        rol: user.rol,
        activo: user.activo
      },
      { where: { id: user.id } }
    );
  }

  async delete(id: string): Promise<void> {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
  }

  async getById(id: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findByPk(id);
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives(userDatabase.get({ plain: true }));
  }

  async getAll(limit: number = 20, page: number = 1): Promise<{ data: UserEntity[]; pageCounter: number }> {
    const usersCounter = await UserModel.count();
    const allPages = Math.ceil(usersCounter / limit);
    const offset = (page - 1) * limit;

    const usersDatabase = await UserModel.findAll({ offset, limit, order: [['email', 'ASC']] });
    const users = usersDatabase.map(user => UserEntity.fromPrimitives(user.get({ plain: true })));

    return { data: users, pageCounter: allPages };
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({ where: { email } });
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives(userDatabase.get({ plain: true }));
  }
}
