import { AuthRepository } from '@src/contexts/auth/core/repository/auth-repository';
import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';
import { RoleEntity } from '@src/contexts/auth/core/entities/role-entity';

export class AuthJWTRepository implements AuthRepository {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { username, status: 'ACTIVO' }
    });
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives({
      ...userDatabase.get({ plain: true }),
      role: userDatabase.get({ plain: true }).role_id
    });
  }

  async getRoleById(roleId: string): Promise<RoleEntity | null> {
    return await this.roleRepository.getById(roleId);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { email, status: 'ACTIVO' }
    });
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives({
      ...userDatabase.get({ plain: true }),
      role: userDatabase.get({ plain: true }).role_id
    });
  }
}
