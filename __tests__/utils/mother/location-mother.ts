import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import {
  BenefitType,
  SlotEntity,
  SlotStatus,
  SlotType,
  VehicleType
} from '../../../src/contexts/location/core/entities/slot-entity';
import {
  LocationEntity,
  LocationStatus
} from '../../../src/contexts/location/core/entities/location-entity';

export class LocationMother {
  static createLocationRequest(
    name: string = faker.lorem.word(70),
    address: string = faker.lorem.word(70),
    contactReference: string = faker.lorem.word(60),
    phone: string = faker.phone.number(),
    email: string = faker.internet.email(),
    comments: string = faker.lorem.word(200),
    numberOfIdentifier: string = faker.lorem.word(20),
    status: string = 'ACTIVO',
    slots: {
      slotNumber: string;
      slotType: string;
      limitOfAssignments: number;
      status: string;
      benefitType: string;
      vehicleType: string;
      amount: number;
      id?: string;
    }[] = [
      {
        slotNumber: faker.lorem.word(20),
        slotType: 'SIMPLE',
        limitOfAssignments: 1,
        status: 'DISPONIBLE',
        benefitType: 'SIN_COSTO',
        vehicleType: 'CARRO',
        amount: 0
      },
      {
        slotNumber: faker.lorem.word(20),
        slotType: 'MULTIPLE',
        limitOfAssignments: 5,
        status: 'DISPONIBLE',
        benefitType: 'DESCUENTO',
        vehicleType: 'CARRO',
        amount: 100
      },
      {
        slotNumber: faker.lorem.word(20),
        slotType: 'SIMPLE',
        limitOfAssignments: 1,
        status: 'DISPONIBLE',
        benefitType: 'COMPLEMENTO',
        vehicleType: 'CARRO',
        amount: 100
      }
    ],
    slotsToDelete: string[] = []
  ) {
    return {
      name,
      address,
      contactReference,
      phone,
      email,
      comments,
      numberOfIdentifier,
      status,
      slots,
      slotsToDelete
    };
  }

  static createSlotRequest(
    id?: string,
    slotNumber = faker.lorem.word(20),
    slotType = SlotType.SIMPLE,
    limitOfAssignments = 1,
    status = SlotStatus.ACTIVE,
    benefitType = BenefitType.NO_COST,
    vehicleType = VehicleType.CAR,
    amount = 0,
  ) {
    return {
      id,
      slotNumber,
      slotType,
      limitOfAssignments,
      status,
      benefitType,
      vehicleType,
      amount,
    };
  }

  static addNewStatusToSlot(data: any, newStatus: SlotStatus) {
    return {
      ...data,
      status: newStatus
    };
  }

  static createSlotEntity(
    id: string = uuid(),
    slotNumber: string = faker.lorem.word(20),
    slotType: SlotType = SlotType.SIMPLE,
    limitOfAssignments: number = 1,
    benefitType: BenefitType = BenefitType.NO_COST,
    amount: number = 0,
    vehicleType: VehicleType = VehicleType.CAR,
    status: SlotStatus = SlotStatus.ACTIVE
  ): SlotEntity {
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

  static createLocationEntity(
    id: string = uuid(),
    name: string = faker.lorem.word(70),
    address: string = faker.lorem.word(70),
    contactReference: string = faker.lorem.word(60),
    phone: string = faker.phone.number(),
    email: string = faker.internet.email(),
    comments: string = faker.lorem.word(200),
    numberOfIdentifier: string = faker.lorem.word(20),
    status: LocationStatus = LocationStatus.ACTIVE,
    slots: SlotEntity[] = []
  ): LocationEntity {
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

  static createSlotPrimitive(
    id: string = uuid(),
    slotNumber: string = faker.lorem.word(20),
    slotType: SlotType = SlotType.SIMPLE,
    limitOfAssignments: number = 1,
    benefitType: BenefitType = BenefitType.NO_COST,
    amount: number = 0,
    vehicleType: VehicleType = VehicleType.CAR,
    status: SlotStatus = SlotStatus.ACTIVE
  ) {
    return {
      id,
      slotNumber,
      slotType,
      limitOfAssignments,
      benefitType,
      amount,
      vehicleType,
      status
    };
  }

  static createLocationPrimitive(
    id: string = uuid(),
    name: string = faker.lorem.word(70),
    address: string = faker.lorem.word(70),
    contactReference: string = faker.lorem.word(60),
    phone: string = faker.phone.number(),
    email: string = faker.internet.email(),
    comments: string = faker.lorem.word(200),
    numberOfIdentifier: string = faker.lorem.word(20),
    status: LocationStatus = LocationStatus.ACTIVE
  ) {
    return {
      id,
      name,
      address,
      contactReference,
      phone,
      email,
      comments,
      numberOfIdentifier,
      status
    };
  }
}
