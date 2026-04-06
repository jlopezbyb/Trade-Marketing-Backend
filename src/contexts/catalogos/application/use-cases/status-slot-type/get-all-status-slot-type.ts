import { StatusSlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/statys-slot-type-catalog-repository';

export class GetAllStatusSlotTypeUseCase {
  constructor(private readonly statusSlotTypeCatalogRepository: StatusSlotTypeCatalogRepository) {}

  async run() {
    return await this.statusSlotTypeCatalogRepository.getAll();
  }
}
