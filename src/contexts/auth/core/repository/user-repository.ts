import { RoleEntity } from '../entities/role-entity';
import { UserEntity } from '../entities/user-entity';

export interface UserRepository {
  create(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: RoleEntity | string;
  }): Promise<void>;
  update(user: {
    name: string;
    username: string;
    email: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    id: string;
    role: RoleEntity | string;
  }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<UserEntity | null>;
  getAll(limit: number, page: number): Promise<{ data: UserEntity[]; pageCounter: number }>;
  getByEmailOrUsername(email: string, username: string): Promise<UserEntity | null>;
}
