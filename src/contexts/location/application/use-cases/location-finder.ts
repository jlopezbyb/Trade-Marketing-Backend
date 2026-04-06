import { LocationRepository } from '@src/contexts/location/core/repositories/location-repository';
import { LocationFinderResult } from '@src/contexts/location/core/repositories/location-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class LocationFinder {
  constructor(private readonly locationRepository: LocationRepository) {}

  public async run(limit: number, page: number): Promise<LocationFinderResult | null> {
    try {
      return await this.locationRepository.getLocations(limit, page);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.log(error);

      throw new AppError('UNKNOWN_ERROR', 500, 'Error not identified on location finder use case', false);
    }
  }
}
