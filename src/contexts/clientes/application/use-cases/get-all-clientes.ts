import { ClienteRepository } from '../../core/repository/cliente.repository';

export class GetAllClientesUseCase {
  constructor(private readonly repo: ClienteRepository) {}

  async run(limit: number, page: number) {
    return this.repo.getAll(limit, page);
  }
}
