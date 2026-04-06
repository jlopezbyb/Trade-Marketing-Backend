import { SlotTypeEntity } from '../entities/slot-type-catalog-entity';

export interface SlotTypeCatalogRepository {
  create(SlotTypeEntity: SlotTypeEntity): Promise<void>;
  getAll(): Promise<SlotTypeEntity[]>;
  getById(id: string): Promise<SlotTypeEntity | null>;
  update(SlotTypeEntity: SlotTypeEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
