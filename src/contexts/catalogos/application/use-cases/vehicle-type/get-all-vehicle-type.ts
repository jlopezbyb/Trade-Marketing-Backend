import { VehicleTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/vehicle-type-catalog-repository';

export class GetAllVehicleTypeUseCase {
  constructor(private readonly vehicleTypeCatalogRepository: VehicleTypeCatalogRepository) {}

  async run() {
    return await this.vehicleTypeCatalogRepository.getAll();
  }
}
