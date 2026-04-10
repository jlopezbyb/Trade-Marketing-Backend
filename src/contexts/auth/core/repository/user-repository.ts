import { UserEntity, UserRol } from '../entities/user-entity';

export interface UserRepository {
  create(user: { email: string; employee_code: string; nombre: string; rol: UserRol }): Promise<void>;
  update(user: {
    id: string;
    email: string;
    employee_code: string;
    nombre: string;
    rol: UserRol;
    activo: boolean;
  }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<UserEntity | null>;
  getAll(limit: number, page: number): Promise<{ data: UserEntity[]; pageCounter: number }>;
  getByEmail(email: string): Promise<UserEntity | null>;
}
