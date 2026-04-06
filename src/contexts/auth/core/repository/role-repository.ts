import { RoleEntity } from '../entities/role-entity';
import { ResourceEntity } from '../entities/resource-entity';
import { UserEntity } from '../entities/user-entity';

export interface RoleRepository {
  create(user: { name: string; description: string; status: string; listOfAccess: [] }): Promise<void>;
  update(user: { id: string; name: string; description: string; status: string; listOfAccess: [] }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<RoleEntity | null>;
  getAll(limit: number, page: number): Promise<{ data: RoleEntity[]; pageCounter: number }>;
  getUsersActiveByRoleId(roleId: string): Promise<Array<UserEntity>>;
  getResources(): Promise<ResourceEntity[]>;
}
