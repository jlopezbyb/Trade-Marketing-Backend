import { SlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/slot-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class GetByIdSlotTypeUseCase {
  constructor(private readonly SlotTypeRepository: SlotTypeCatalogRepository) {}

  async run(id: string) {
    const SlotType = await this.SlotTypeRepository.getById(id);

    if (!SlotType) throw new AppError('Slot_TYPE_NOT_FOUND', 404, 'Slot type not found', true);

    return SlotType;
  }
}
