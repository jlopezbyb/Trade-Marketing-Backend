import { VisitaEntity } from '../entities/visita.entity';

export interface VisitaRepository {
  getAll(limit: number, page: number): Promise<{ data: VisitaEntity[]; total: number }>;
  create(data: { cliente_id: string; usuario_id: string; fecha: string; observaciones?: string }): Promise<VisitaEntity>;
  update(
    id: string,
    data: Partial<{ cliente_id: string; usuario_id: string; fecha: string; observaciones: string | null }>
  ): Promise<VisitaEntity | null>;
  delete(id: string): Promise<boolean>;
}
