import { v4 as uuid } from 'uuid';
import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';
import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';

import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { RoleModel } from '@src/contexts/shared/infrastructure/models/auth/role.model';
import { Op } from 'sequelize';

export class MySQLSequelizeUserRepository implements UserRepository {
  async create(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: string;
  }): Promise<void> {
    const userEntity = UserEntity.fromPrimitives({ ...user, id: uuid() });
    await UserModel.create({ ...userEntity, roleId: userEntity.role });
  }

  async update(user: {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: string;
  }): Promise<void> {
    const userEntity = UserEntity.fromPrimitives({ ...user, username: '' });
    await UserModel.update(
      { ...userEntity, role_id: userEntity.role },
      {
        where: { id: user.id },
        fields: ['name', 'email', 'status', 'phone', 'role_id']
      }
    );
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async getById(id: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: RoleModel,
          as: 'role',
          attributes: ['id', 'name', 'description', 'status']
        }
      ]
    });

    if (!userDatabase) return null;

    const plainData = userDatabase.get({ plain: true });
    return UserEntity.fromPrimitives({ ...plainData, role: plainData.role });
  }

  async getAll(limit: number = 20, page: number = 1): Promise<{ data: UserEntity[]; pageCounter: number }> {
    const usersCounter = await UserModel.count();
    const allPages = Math.ceil(usersCounter / limit);
    const offset = (page - 1) * limit;

    const usersDatabase = await UserModel.findAll({
      offset,
      limit,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: RoleModel,
          as: 'role',
          attributes: ['id', 'name', 'description', 'status'],
          order: [['email', 'ASC']]
        }
      ]
    });

    const users = usersDatabase.map(user => UserEntity.fromPrimitives(user.get({ plain: true })));

    return {
      data: users,
      pageCounter: allPages
    };
  }

  async getByEmailOrUsername(email: string, username: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      },
      paranoid: false // Incluye registros eliminados
    });

    if (!userDatabase) return null;

    const plainData = userDatabase.get({ plain: true });
    return UserEntity.fromPrimitives({ ...plainData, role: plainData.role });
  }
}
