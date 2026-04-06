import { UserEntity, UserRol } from '../entities/user-entity';

export interface UserRepository {
  create(user: { email: string; employee_code: string; nombre: string; rol: UserRol }): Promise<void>;
  update(user: {
    id: number;
    email: string;
    employee_code: string;
    nombre: string;
    rol: UserRol;
    activo: boolean;
  }): Promise<void>;
  delete(id: number): Promise<void>;
  getById(id: number): Promise<UserEntity | null>;
  getAll(limit: number, page: number): Promise<{ data: UserEntity[]; pageCounter: number }>;
  getByEmail(email: string): Promise<UserEntity | null>;
}
