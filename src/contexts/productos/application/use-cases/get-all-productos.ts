import { ProductoRepository } from '../../core/repository/producto.repository';

export class GetAllProductosUseCase {
  constructor(private readonly repo: ProductoRepository) {}

  async run(limit: number, page: number) {
    return this.repo.getAll(limit, page);
  }
}
