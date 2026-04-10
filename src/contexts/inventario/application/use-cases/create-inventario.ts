import { InventarioRepository, InventarioItem } from '../../core/repository/inventario.repository';

export class CreateInventarioUseCase {
  constructor(private readonly repo: InventarioRepository) {}

  async run(cliente_id: string, fecha: string, items: InventarioItem[]) {
    return this.repo.createBulk(cliente_id, fecha, items);
  }
}
