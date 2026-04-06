import { CategoriaEntity } from '../entities/categoria.entity';

export interface CategoriaRepository {
  getAll(): Promise<CategoriaEntity[]>;
  create(data: { nombre: string; descripcion?: string; color?: string }): Promise<CategoriaEntity>;
  update(
    id: number,
    data: Partial<{ nombre: string; descripcion: string | null; color: string | null; activo: boolean }>
  ): Promise<CategoriaEntity | null>;
  delete(id: number): Promise<boolean>;
}
