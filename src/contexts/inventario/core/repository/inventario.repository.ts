import { InventarioEntity } from '../entities/inventario.entity';

export interface InventarioItem {
  producto_id: string;
  cantidad: number;
  lotes?: { lote: string; cantidad: number; fecha_vencimiento: string }[];
}

export interface InventarioRepository {
  getAll(limit: number, page: number): Promise<{ data: InventarioEntity[]; total: number }>;
  createBulk(cliente_id: string, fecha: string, items: InventarioItem[]): Promise<InventarioEntity[]>;
  update(
    id: string,
    data: Partial<{ cliente_id: string; producto_id: string; cantidad: number; fecha_actualizacion: string }>
  ): Promise<InventarioEntity | null>;
  delete(id: string): Promise<boolean>;
}
