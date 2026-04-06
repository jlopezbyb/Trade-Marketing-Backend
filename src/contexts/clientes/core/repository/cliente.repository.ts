import { ClienteEntity } from '../entities/cliente.entity';

export interface ClienteRepository {
  getAll(limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }>;
  getById(id: number): Promise<ClienteEntity | null>;
}
