import { VehicleTypeEntity } from '@src/contexts/catalogos/core/entities/vehicle-type-catalog-entity';
import { VehicleTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/vehicle-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateVehicleTypeUseCase {
  constructor(private readonly vehicleTypeCatalogRepository: VehicleTypeCatalogRepository) {}

  async run(id: string, data: { name: string; description: string; isActive: boolean }) {
    const vehicleType = await this.vehicleTypeCatalogRepository.getById(id);

    if (!vehicleType) throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);

    const vehicleTypeUpdated = VehicleTypeEntity.fromPrimitives({
      ...vehicleType.toPrimitives(),
      name: data.name,
      description: data.description,
      isActive: data.isActive
    });

    await this.vehicleTypeCatalogRepository.update(vehicleTypeUpdated);
  }
}
