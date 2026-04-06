import { VisitaEntity } from '../entities/visita.entity';

export interface VisitaRepository {
  getAll(limit: number, page: number): Promise<{ data: VisitaEntity[]; total: number }>;
  create(data: { cliente_id: number; usuario_id: number; fecha: string; observaciones?: string }): Promise<VisitaEntity>;
}
