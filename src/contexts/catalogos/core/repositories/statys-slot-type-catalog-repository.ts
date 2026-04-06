import { StatusSlotEntity } from '../entities/status-slot-type-entity';

export interface StatusSlotTypeCatalogRepository {
  create(SlotTypeEntity: StatusSlotEntity): Promise<void>;
  getAll(): Promise<StatusSlotEntity[]>;
  getById(id: string): Promise<StatusSlotEntity | null>;
  update(SlotTypeEntity: StatusSlotEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
