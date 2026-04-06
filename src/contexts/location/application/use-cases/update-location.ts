import { ForeignKeyConstraintError } from 'sequelize';
import { LocationRepository } from '@src/contexts/location/core/repositories/location-repository';
import { LocationEntity } from '@src/contexts/location/core/entities/location-entity';
import { LocationStatus } from '@src/contexts/location/core/entities/location-entity';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { SlotType } from '@src/contexts/location/core/entities/slot-entity';
import { SlotStatus } from '@src/contexts/location/core/entities/slot-entity';
import { BenefitType } from '@src/contexts/location/core/entities/slot-entity';
import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';

import { ValidationsUseCases } from './validations';

export class UpdateLocation {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly validationsUseCases: ValidationsUseCases
  ) {}

  public async run(
    data: {
      id: string;
      name: string;
      address: string;
      contactReference: string;
      phone: string;
      email: string;
      comments: string;
      numberOfIdentifier: string;
      status: LocationStatus;
      slots: {
        id: string;
        slotNumber: string;
        slotType: SlotType;
        limitOfAssignments: number;
        status: SlotStatus;
        benefitType: BenefitType;
        vehicleType: VehicleType;
        amount: number;
      }[];
    },
    slotsToDelete: Set<string>
  ): Promise<void> {
    try {
      const locationEntity = LocationEntity.fromPrimitives(data);

      await this.validationsUseCases.validateIfCanUpdate({
        locationId: data.id,
        locationStatus: data.status,
        slots: data.slots,
        slotsToDelete: new Set(slotsToDelete)
      });

      await this.locationRepository.updateLocation(locationEntity, slotsToDelete);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new AppError('FOREING_KEY_CONSTRAINT', 400, 'You can not delete slots with assignment or schedule', true);
      }

      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new AppError('UNKNOWN_ERROR', 500, 'Error not identified on update location use case', false);
    }
  }
}
