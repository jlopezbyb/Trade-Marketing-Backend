import { StatusSlotTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/statys-slot-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class GetByIdStatusSlotTypeUseCase {
  constructor(private readonly statusSlotTypeCatalogRepository: StatusSlotTypeCatalogRepository) {}

  async run(id: string) {
    const statusSlotType = await this.statusSlotTypeCatalogRepository.getById(id);
    if (!statusSlotType) throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);
    return statusSlotType;
  }
}
