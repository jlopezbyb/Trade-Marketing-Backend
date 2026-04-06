import { v4 as uuid } from 'uuid';
import { VehicleTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/vehicle-type-catalog-repository';
import { VehicleTypeEntity } from '@src/contexts/catalogos/core/entities/vehicle-type-catalog-entity';
export class CreateVehicleTypeUseCase {
  constructor(private readonly vehicleTypeCatalogRepository: VehicleTypeCatalogRepository) {}

  async run(data: { name: string; description: string; isActive: boolean }) {
    const vehicleTypeEntity = VehicleTypeEntity.fromPrimitives({
      ...data,
      id: uuid()
    });
    await this.vehicleTypeCatalogRepository.create(vehicleTypeEntity);
  }
}
