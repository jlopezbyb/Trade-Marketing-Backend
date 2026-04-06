import { ProductoEntity } from '../entities/producto.entity';

export interface ProductoRepository {
  getAll(limit: number, page: number): Promise<{ data: ProductoEntity[]; total: number }>;
}
