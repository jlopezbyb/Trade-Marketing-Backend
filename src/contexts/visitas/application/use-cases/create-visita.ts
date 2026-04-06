import { VisitaRepository } from '../../core/repository/visita.repository';

export class CreateVisitaUseCase {
  constructor(private readonly repo: VisitaRepository) {}

  async run(data: { cliente_id: number; usuario_id: number; fecha: string; observaciones?: string }) {
    return this.repo.create(data);
  }
}
