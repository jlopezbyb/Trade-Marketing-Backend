import { faker } from '@faker-js/faker';
import {
  LocationEntity,
  LocationStatus
} from '../../../src/contexts/location/core/entities/location-entity';
import {
  BenefitType,
  SlotEntity,
  SlotStatus,
  SlotType,
  VehicleType
} from '../../../src/contexts/location/core/entities/slot-entity';
import { LocationModel } from '../../../src/contexts/shared/infrastructure/models/parking/location.model';
import { SlotModel } from '../../../src/contexts/shared/infrastructure/models/parking/slot.model';

export class LocationBuilder {
  private locationEntity: LocationEntity;

  constructor() {
    this.locationEntity = this.createLocationEntity({});
  }

  private createLocationEntity({
    id = faker.string.uuid(),
    name = faker.lorem.word(70),
    address = faker.lorem.word(70),
    contactReference = faker.lorem.word(60),
    phone = faker.phone.number(),
    email = faker.internet.email(),
    comments = faker.lorem.word(200),
    numberOfIdentifier = faker.lorem.word(20),
    status = faker.helpers.arrayElement([
      'ACTIVO',
      'INACTIVO'
    ]) as LocationStatus,
    slots = []
  }: {
    id?: string;
    name?: string;
    address?: string;
    contactReference?: string;
    phone?: string;
    email?: string;
    comments?: string;
    numberOfIdentifier?: string;
    status?: LocationStatus;
    slots?: SlotEntity[];
  }): LocationEntity {
    return new LocationEntity(
      id,
      name,
      address,
      contactReference,
      phone,
      email,
      comments,
      numberOfIdentifier,
      status,
      slots
    );
  }

  public withActiveStatus(): LocationBuilder {
    this.locationEntity = LocationEntity.fromPrimitives({
      ...this.createLocationEntity({}),
      status: LocationStatus.ACTIVE
    });
    return this;
  }

  public withInactiveStatus(): LocationBuilder {
    this.locationEntity = LocationEntity.fromPrimitives({
      ...this.createLocationEntity({}),
      status: LocationStatus.INACTIVE
    });
    return this;
  }

  public async build(): Promise<LocationEntity> {
    await LocationModel.create({ ...this.locationEntity.toPrimitives() });
    return this.locationEntity;
  }
}

export class SlotBuilder {
  private _slotEntity: SlotEntity;

  constructor() {
    this._slotEntity = this.createSlotEntity({});
  }

  private createSlotEntity({
    id = faker.string.uuid(),
    slotNumber = faker.lorem.word(20),
    slotType = faker.helpers.arrayElement(['SIMPLE', 'MULTIPLE']) as SlotType,
    limitOfAssignments = slotType === SlotType.SIMPLE
      ? 1
      : faker.number.int({ min: 2, max: 5 }),
    benefitType = faker.helpers.arrayElement([
      'SIN_COSTO',
      'DESCUENTO',
      'COMPLEMENTO'
    ]) as BenefitType,
    amount = benefitType === BenefitType.NO_COST
      ? 0
      : faker.number.int({ min: 1, max: 100 }),
    vehicleType = faker.helpers.arrayElement([
      'CARRO',
      'MOTO',
      'CAMION'
    ]) as VehicleType,
    status = faker.helpers.arrayElement([
      'DISPONIBLE',
      'INACTIVO'
    ]) as SlotStatus
  }: {
    id?: string;
    slotNumber?: string;
    slotType?: SlotType;
    limitOfAssignments?: number;
    benefitType?: BenefitType;
    amount?: number;
    vehicleType?: VehicleType;
    status?: SlotStatus;
  }): SlotEntity {
    return new SlotEntity(
      id,
      slotNumber,
      slotType,
      limitOfAssignments,
      benefitType,
      amount,
      vehicleType,
      status
    );
  }

  public withTypeSingle(): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      slotType: SlotType.SIMPLE,
      limitOfAssignments: 1
    });

    return this;
  }

  public withTypeMultiple(limit: number): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      slotType: SlotType.MULTIPLE,
      limitOfAssignments: limit
    });

    return this;
  }

  public withOccupiedStatus(): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.OCCUPIED
    });

    return this;
  }

  public withInactiveStatus(): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.INACTIVE
    });

    return this;
  }

  public withAvailableStatus(): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      status: SlotStatus.ACTIVE
    });

    return this;
  }

  public withVehicleType(vehicleType: VehicleType): SlotBuilder {
    this._slotEntity = SlotEntity.fromPrimitives({
      ...this._slotEntity.toPrimitives(),
      vehicleType
    });

    return this;
  }

  public get slotEntity(): SlotEntity {
    return this._slotEntity;
  }

  public async build(locationId: string): Promise<SlotEntity> {
    await SlotModel.create({ ...this._slotEntity.toPrimitives(), locationId });
    return this._slotEntity;
  }
}
