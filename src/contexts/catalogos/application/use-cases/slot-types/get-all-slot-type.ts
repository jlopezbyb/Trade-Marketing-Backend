import { SlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/slot-type-catalog-repository';
export class GetAllSlotTypeUseCase {
  constructor(private readonly SlotTypeCatalogRepository: SlotTypeCatalogRepository) {}

  async run() {
    const data = await this.SlotTypeCatalogRepository.getAll();
    return data;
  }
}
