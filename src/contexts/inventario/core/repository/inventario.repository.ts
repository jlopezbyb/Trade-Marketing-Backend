import { InventarioEntity } from '../entities/inventario.entity';

export interface InventarioItem {
  producto_id: number;
  cantidad: number;
  lotes?: { lote: string; cantidad: number; fecha_vencimiento: string }[];
}

export interface InventarioRepository {
  getAll(limit: number, page: number): Promise<{ data: InventarioEntity[]; total: number }>;
  createBulk(cliente_id: number, fecha: string, items: InventarioItem[]): Promise<InventarioEntity[]>;
  update(
    id: number,
    data: Partial<{ cliente_id: number; producto_id: number; cantidad: number; fecha_actualizacion: string }>
  ): Promise<InventarioEntity | null>;
  delete(id: number): Promise<boolean>;
}
