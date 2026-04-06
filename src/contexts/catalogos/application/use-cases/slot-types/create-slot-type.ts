import { v4 as uuid } from 'uuid';
import { SlotTypeEntity } from '@src/contexts/catalogos/core/entities/slot-type-catalog-entity';
import { SlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/slot-type-catalog-repository';

export class CreateSlotTypeUseCase {
  constructor(private readonly SlotTypeRepository: SlotTypeCatalogRepository) {}

  async run(data: { name: string; description: string; allowParallelAssignments: boolean; isActive: boolean }) {
    const SlotType = SlotTypeEntity.fromPrimitives({ ...data, id: uuid() });
    await this.SlotTypeRepository.create(SlotType);
  }
}
