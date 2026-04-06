import { StatusEntity } from '@src/contexts/catalogos/core/entities/status-catalog-entity';
import { StatusTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/status-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateStatusTypeUseCase {
  constructor(private readonly statusTypeCatalogRepository: StatusTypeCatalogRepository) {}

  async run(id: string, data: { name: string; description: string; isActive: boolean }) {
    const statusType = await this.statusTypeCatalogRepository.getById(id);

    if (!statusType) throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);

    const statusTypeUpdated = StatusEntity.fromPrimitives({
      ...statusType.toPrimitives(),
      name: data.name,
      description: data.description,
      isActive: data.isActive
    });

    await this.statusTypeCatalogRepository.update(statusTypeUpdated);
  }
}
