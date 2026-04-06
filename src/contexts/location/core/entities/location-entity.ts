import { BenefitType, SlotEntity, SlotStatus, SlotType, VehicleType } from './slot-entity';

export enum LocationStatus {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO'
}

export class LocationEntity {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly contactReference: string; //optional
  readonly phone: string; //optional
  readonly email: string;
  readonly comments: string; //optional
  readonly numberOfIdentifier: string; //optional
  readonly status: LocationStatus;
  readonly slots: SlotEntity[];

  constructor(
    id: string,
    name: string,
    address: string,
    contactReference: string,
    phone: string,
    email: string,
    comments: string,
    numberOfIdentifier: string,
    status: LocationStatus,
    slots: SlotEntity[]
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.slots = slots;
    this.contactReference = contactReference;
    this.phone = phone;
    this.email = email;
    this.comments = comments;
    this.numberOfIdentifier = numberOfIdentifier;
    this.status = status;
  }

  static fromPrimitives(primitiveData: {
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
      benefitType: BenefitType;
      amount: number;
      vehicleType: VehicleType;
      status: SlotStatus;
    }[];
  }) {
    return new LocationEntity(
      primitiveData.id,
      primitiveData.name,
      primitiveData.address,
      primitiveData.contactReference,
      primitiveData.phone,
      primitiveData.email,
      primitiveData.comments,
      primitiveData.numberOfIdentifier,
      primitiveData.status,
      primitiveData.slots ? primitiveData.slots.map(slot => SlotEntity.fromPrimitives(slot)) : []
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      contactReference: this.contactReference,
      phone: this.phone,
      email: this.email,
      comments: this.comments,
      numberOfIdentifier: this.numberOfIdentifier,
      status: this.status,
      slots: this.slots.map(slot => slot.toPrimitives())
    };
  }
}
