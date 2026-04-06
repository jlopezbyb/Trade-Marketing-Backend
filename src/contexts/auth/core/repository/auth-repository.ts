import { RoleEntity } from '../entities/role-entity';
import { UserEntity } from '../entities/user-entity';

export interface AuthRepository {
  findUserByUsername(username: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  getRoleById(roleId: string): Promise<RoleEntity | null>;
}
