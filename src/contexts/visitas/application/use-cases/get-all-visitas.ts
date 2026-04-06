import { VisitaRepository } from '../../core/repository/visita.repository';

export class GetAllVisitasUseCase {
  constructor(private readonly repo: VisitaRepository) {}

  async run(limit: number, page: number) {
    return this.repo.getAll(limit, page);
  }
}
