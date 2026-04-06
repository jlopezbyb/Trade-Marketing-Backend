import { CategoriaEntity } from '../entities/categoria.entity';

export interface CategoriaRepository {
  getAll(): Promise<CategoriaEntity[]>;
}
