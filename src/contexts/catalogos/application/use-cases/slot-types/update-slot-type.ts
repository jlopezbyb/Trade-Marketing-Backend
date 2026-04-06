import { SlotTypeEntity } from '@src/contexts/catalogos/core/entities/slot-type-catalog-entity';
import { SlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/slot-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateSlotTypeUseCase {
  constructor(private readonly SlotTypeCatalogRepository: SlotTypeCatalogRepository) {}

  async run(id: string, data: { name: string; description: string; allowParallelAssignments: boolean; isActive: boolean }) {
    const Slot = await this.SlotTypeCatalogRepository.getById(id);

    if (!Slot) throw new AppError('Slot_NOT_FOUND', 404, 'Slot type not found!', true);

    const SlotUpdate = SlotTypeEntity.fromPrimitives({
      ...data,
      id: Slot.id
    });

    await this.SlotTypeCatalogRepository.update(SlotUpdate);
  }
}
