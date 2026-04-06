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
    // Buscar usuario eliminado con el mismo email o username
    const deletedUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ email: user.email }, { username: user.username }]
      },
      paranoid: false // Incluye registros eliminados
    });

    if (deletedUser) {
      // Restaurar el usuario eliminado
      await deletedUser.restore();
      // Actualizar sus datos
      await deletedUser.update({
        ...user,
        status: 'ACTIVO',
        roleId: user.role
      });
      return;
    }

    // Si no existe un usuario eliminado, crear uno nuevo
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
    await UserModel.update(
      {
        name: user.name,
        username: user.username, // ✅ ¡aquí está el fix!
        email: user.email,
        status: user.status,
        phone: user.phone,
        role_id: user.role
      },
      {
        where: { id: user.id },
        fields: ['name', 'username', 'email', 'status', 'phone', 'role_id']
      }
    );
  }

  async delete(id: string): Promise<void> {
    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
  }

  async getById(id: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: RoleModel,
          as: 'role',
          attributes: ['id', 'name', 'description', 'status']
        }
      ]
      // No necesitas agregar deleted_at: null porque paranoid: true lo maneja
    });

    if (!userDatabase) return null;

    const plainData = userDatabase.get({ plain: true });
    return UserEntity.fromPrimitives({ ...plainData, role: plainData.role });
  }

  async getAll(limit: number = 20, page: number = 1): Promise<{ data: UserEntity[]; pageCounter: number }> {
    const usersCounter = await UserModel.count(); // Paranoid excluye automáticamente los eliminados
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
