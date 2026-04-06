import { StatusTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/status-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class GetByIdStatusTypeUseCase {
  constructor(private readonly statusTypeCatalogRepository: StatusTypeCatalogRepository) {}

  async run(id: string) {
    const statusType = await this.statusTypeCatalogRepository.getById(id);
    if (!statusType) throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);
    return statusType;
  }
}
