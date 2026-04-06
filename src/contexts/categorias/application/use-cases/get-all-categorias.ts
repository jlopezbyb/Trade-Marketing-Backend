import { CategoriaRepository } from '../../core/repository/categoria.repository';

export class GetAllCategoriasUseCase {
  constructor(private readonly repo: CategoriaRepository) {}

  async run() {
    return this.repo.getAll();
  }
}
