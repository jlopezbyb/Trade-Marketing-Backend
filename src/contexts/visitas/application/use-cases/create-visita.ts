import { VisitaRepository } from '../../core/repository/visita.repository';

export class CreateVisitaUseCase {
  constructor(private readonly repo: VisitaRepository) {}

  async run(data: { cliente_id: string; usuario_id: string; fecha: string; observaciones?: string }) {
    return this.repo.create(data);
  }
}
