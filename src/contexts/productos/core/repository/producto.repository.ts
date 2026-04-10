import { ProductoEntity } from '../entities/producto.entity';

export interface ProductoRepository {
  getAll(limit: number, page: number): Promise<{ data: ProductoEntity[]; total: number }>;
  create(data: {
    nombre: string;
    sku: string;
    unidad: string;
    categoria_id: string;
    imagen_url?: string;
  }): Promise<ProductoEntity>;
  update(
    id: string,
    data: Partial<{
      nombre: string;
      sku: string;
      unidad: string;
      categoria_id: string;
      imagen_url: string | null;
      activo: boolean;
    }>
  ): Promise<ProductoEntity | null>;
  delete(id: string): Promise<boolean>;
}
