import { ClienteEntity } from '../entities/cliente.entity';

export interface ClienteRepository {
  getAll(limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }>;
  getById(id: string): Promise<ClienteEntity | null>;
  create(data: {
    nombre: string;
    cliente_code: string;
    direccion: string;
    telefono: string;
    contacto: string;
    email?: string;
    imagen_url?: string;
  }): Promise<ClienteEntity>;
  update(
    id: string,
    data: Partial<{
      nombre: string;
      cliente_code: string;
      direccion: string;
      telefono: string;
      contacto: string;
      email: string | null;
      imagen_url: string | null;
      activo: boolean;
    }>
  ): Promise<ClienteEntity | null>;
  delete(id: string): Promise<boolean>;
  getByUsuarioId(usuarioId: string, limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }>;
}
