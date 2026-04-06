import { SlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/slot-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteSlotTypeUseCase {
  constructor(private readonly SlotTypeCatalogRepository: SlotTypeCatalogRepository) {}

  async run(id: string) {
    const Slot = await this.SlotTypeCatalogRepository.getById(id);

    if (!Slot) throw new AppError('Slot_NOT_FOUND', 404, 'Slot type not found!', true);

    await this.SlotTypeCatalogRepository.delete(id);
  }
}
