import { ClienteEntity } from '../entities/cliente.entity';

export interface ClienteRepository {
  getAll(limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }>;
  getById(id: number): Promise<ClienteEntity | null>;
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
    id: number,
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
  delete(id: number): Promise<boolean>;
  getByUsuarioId(usuarioId: number, limit: number, page: number): Promise<{ data: ClienteEntity[]; total: number }>;
}
