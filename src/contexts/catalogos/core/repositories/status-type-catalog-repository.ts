import { StatusEntity } from '../entities/status-catalog-entity';

export interface StatusTypeCatalogRepository {
  create(SlotTypeEntity: StatusEntity): Promise<void>;
  getAll(): Promise<StatusEntity[]>;
  getById(id: string): Promise<StatusEntity | null>;
  update(SlotTypeEntity: StatusEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
