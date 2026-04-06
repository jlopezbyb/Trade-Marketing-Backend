import { VehicleTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/vehicle-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { ForeignKeyConstraintError } from 'sequelize';

export class DeleteVehicleTypeUseCase {
  constructor(private readonly vehicleTypeCatalogRepository: VehicleTypeCatalogRepository) {}

  async run(id: string) {
    const vehicleType = await this.vehicleTypeCatalogRepository.getById(id);
    if (!vehicleType) {
      throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);
    }

    const name = vehicleType.name;

    const usedInVehicles = await this.vehicleTypeCatalogRepository.isUsedInVehicles(name);
    const usedInSlots = await this.vehicleTypeCatalogRepository.isUsedInSlots(name);

    if (usedInVehicles || usedInSlots) {
      throw new AppError(
        'VEHICLE_TYPE_IN_USE',
        400,
        `Cannot delete vehicle type '${name}': It is being used in ${usedInVehicles ? 'vehicles' : ''}${usedInVehicles && usedInSlots ? ' and ' : ''}${usedInSlots ? 'slots' : ''}.`,
        true
      );
    }

    try {
      await this.vehicleTypeCatalogRepository.delete(id);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new AppError('FOREIGN_KEY_CONSTRAINT', 400, 'Cannot delete vehicle type: It is referenced by another record', true);
      }
      throw new AppError('INTERNAL_SERVER_ERROR', 500, 'An unexpected error occurred', true);
    }
  }

  private isForeignKeyError(error: any): boolean {
    return error instanceof ForeignKeyConstraintError || error.original?.errno === 1451;
  }
}
