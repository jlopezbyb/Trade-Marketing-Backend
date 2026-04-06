import { ForeignKeyConstraintError } from 'sequelize';
import { LocationRepository } from '@src/contexts/location/core/repositories/location-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteLocation {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(id: string): Promise<void> {
    try {
      const location = await this.locationRepository.getLocationById(id);

      if (!location) {
        throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);
      }

      if (await this.locationRepository.executeFunction('location_has_active_assignment', [id])) {
        throw new AppError('FOREING_KEY_CONSTRAINT', 400, 'You cannot delete a location with active assignments', true);
      }

      await this.locationRepository.deleteLocation(id);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new AppError('FOREING_KEY_CONSTRAINT', 400, 'You can not delete slots with assignment or schedule', true);
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('UNEXPECTED_ERROR', 500, 'Unexpected error', false);
    }
  }
}
