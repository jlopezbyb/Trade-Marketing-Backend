import { LocationStatus } from '@src/contexts/location/core/entities/location-entity';
import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { LocationRepository, ResponseAvailableSlots } from '@src/contexts/location/core/repositories/location-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class SlotsAvailableFinderUseCase {
  constructor(private readonly locationRepository: LocationRepository) {}
  async run(locationId: string, vehicleType: VehicleType): Promise<ResponseAvailableSlots[]> {
    const location = await this.locationRepository.getLocationById(locationId);

    if (!location) throw new AppError('LOCATION_NOT_FOUND', 404, 'Location not found', true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (location.status === LocationStatus.INACTIVE) return [];

    return this.locationRepository.getAvailableSlotsByTypeVehicleAndLocationId(locationId, vehicleType);
  }
}
