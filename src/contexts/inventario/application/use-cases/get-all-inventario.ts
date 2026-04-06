import { InventarioRepository } from '../../core/repository/inventario.repository';

export class GetAllInventarioUseCase {
  constructor(private readonly repo: InventarioRepository) {}

  async run(limit: number, page: number) {
    return this.repo.getAll(limit, page);
  }
}
