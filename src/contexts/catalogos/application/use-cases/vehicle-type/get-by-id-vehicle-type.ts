import { VehicleTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/vehicle-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class GetByIdVehicleTypeUseCase {
  constructor(private readonly vehicleTypeCatalogRepository: VehicleTypeCatalogRepository) {}

  async run(id: string) {
    const vehicleType = await this.vehicleTypeCatalogRepository.getById(id);
    if (!vehicleType) throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);
    return vehicleType;
  }
}
