import { v4 as uuid } from 'uuid';
import { UniqueConstraintError, Op } from 'sequelize';
import { sequelize } from '@src/server/config/database/sequelize';
import { RoleEntity } from '@src/contexts/auth/core/entities/role-entity';
import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';

import { RoleModel } from '@src/contexts/shared/infrastructure/models/auth/role.model';
import { ResourceEntity } from '@src/contexts/auth/core/entities/resource-entity';
import { ResourceModel } from '@src/contexts/shared/infrastructure/models/auth/resource.model';
import { RoleDetailModel } from '@src/contexts/shared/infrastructure/models/auth/role.detail.model';
import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { UserEntity } from '../../core/entities/user-entity';

export class MySQLSequelizeRoleRepository implements RoleRepository {
  async create(data: { name: string; description: string; status: 'ACTIVO' | 'INACTIVO'; listOfAccess: [] }): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const roleId = uuid();
      const roleEntity = RoleEntity.fromPrimitives({
        ...data,
        id: roleId,
        resources: []
      });

      await RoleModel.create({ ...roleEntity }, { fields: ['id', 'name', 'description', 'status'], transaction });

      const listOfAccess = data.listOfAccess.map((access: { resource: string; canAccess: boolean }) => {
        return {
          role_id: roleId,
          resource_id: access.resource,
          canAccess: access.canAccess
        };
      });

      await RoleDetailModel.bulkCreate(listOfAccess, {
        fields: ['role_id', 'resource_id', 'canAccess'],
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        throw new Error('You cannot have a roles with the same resources');
      }

      throw error;
    }
  }

  async update(data: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVO' | 'INACTIVO';
    listOfAccess: [];
  }): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const roleEntity = RoleEntity.fromPrimitives({ ...data, resources: [] });
      await RoleModel.update(
        { ...roleEntity },
        {
          where: { id: data.id },
          fields: ['name', 'description', 'status'],
          transaction
        }
      );

      await Promise.all(
        data.listOfAccess.map((resource: { resource: string; canAccess: boolean }) => {
          return RoleDetailModel.update(
            {
              canAccess: resource.canAccess
            },
            {
              where: { [Op.and]: [{ role_id: data.id }, { resource_id: resource.resource }] },
              transaction
            }
          );
        })
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        throw new Error('You cannot have a roles with the same resources');
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await RoleModel.destroy({ where: { id } });
  }
  /* eslint-disable  @typescript-eslint/no-unsafe-call */
  async getById(id: string): Promise<RoleEntity | null> {
    const roleDatabase = await RoleModel.findOne({
      where: { id },
      include: [
        {
          model: ResourceModel,
          as: 'resources'
        }
      ]
    });

    if (!roleDatabase) return null;

    const plainRoles = roleDatabase.get({ plain: true });
    const rolesEntity = RoleEntity.fromPrimitives(plainRoles);

    rolesEntity.resources = plainRoles.resources.map(
      (res: { id: string; slug: string; description: string; role_detail: { canAccess: boolean } }) => {
        return {
          id: res.id,
          slug: res.slug,
          description: res.description,
          canAccess: res.role_detail.canAccess
        };
      }
    );

    return rolesEntity;
  }

  async getAll(limit: number = 20, page: number = 1): Promise<{ data: RoleEntity[]; pageCounter: number }> {
    const roleCounter = await RoleModel.count();
    const allPages = Math.ceil(roleCounter / limit);
    const offset = (page - 1) * limit;

    const rolesDatabase = await RoleModel.findAll({
      offset,
      limit,
      include: [
        {
          model: ResourceModel,
          as: 'resources'
        }
      ]
    });

    if (!rolesDatabase) return { data: [], pageCounter: 0 };

    const roles = rolesDatabase.map(role =>
      RoleEntity.fromPrimitives({
        ...role.get({ plain: true }),
        resources: role
          .get({ plain: true })
          .resources.map((res: { id: string; slug: string; description: string; role_detail: { canAccess: boolean } }) => {
            return {
              id: res.id,
              slug: res.slug,
              description: res.description,
              canAccess: res.role_detail.canAccess
            };
          })
      })
    );

    return {
      data: roles,
      pageCounter: allPages
    };
  }

  async getResources(): Promise<ResourceEntity[]> {
    const resourcesDatabase = await ResourceModel.findAll();
    const resources = resourcesDatabase.map(resource => ResourceEntity.fromPrimitives(resource.get({ plain: true })));
    return resources;
  }

  async getUsersActiveByRoleId(roleId: string): Promise<Array<UserEntity>> {
    const users = await UserModel.findAll({
      where: { status: 'ACTIVO' },
      include: [{ model: RoleModel, where: { id: roleId } }]
    });

    return users.map(user => {
      const plainUser = user.get({ plain: true });
      return UserEntity.fromPrimitives(plainUser);
    });
  }
}
