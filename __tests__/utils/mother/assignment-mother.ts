import { faker } from '@faker-js/faker';
import { VehicleType } from '../../../src/contexts/location/core/entities/slot-entity';

export class AssignmentRequestMother {
  static createAssignmentRequest({
    slotId = faker.string.uuid(),
    parkingCardNumber = faker.finance.accountNumber(),
    employee = this.createEmployeeRequest(),
    tags = []
  }: {
    slotId?: string;
    parkingCardNumber?: string;
    employee?: {
      id?: string;
      employeeCode?: string;
      name?: string;
      workplace?: string;
      identifierDocument?: string;
      company?: string;
      department?: string;
      subManagement?: string;
      management1?: string;
      management2?: string;
      workSite?: string;
      address?: string;
      email?: string;
      phone?: string;
      vehicles?: {
        id?: string;
        vehicleBadge?: string;
        brand?: string;
        model?: string;
        type?: VehicleType;
        color?: string;
      }[];
    };
    tags?: string[];
  } = {}): {
    slotId?: string;
    parkingCardNumber?: string;
    employee?: {
      id?: string;
      employeeCode?: string;
      name?: string;
      workplace?: string;
      identifierDocument?: string;
      company?: string;
      department?: string;
      subManagement?: string;
      management1?: string;
      management2?: string;
      workSite?: string;
      address?: string;
      email?: string;
      phone?: string;
      vehicles?: {
        id?: string;
        vehicleBadge?: string;
        brand?: string;
        model?: string;
        type?: VehicleType;
        color?: string;
      }[];
    };
    tags?: string[];
  } {
    return {
      slotId,
      parkingCardNumber,
      employee,
      tags
    };
  }

  static createEmployeeRequest({
    id,
    employeeCode = faker.finance.accountNumber(),
    name = faker.person.fullName(),
    workplace = faker.location.streetAddress(),
    identifierDocument = faker.finance.accountNumber(),
    company = faker.company.name(),
    department = faker.commerce.department(),
    subManagement = faker.company.buzzPhrase(),
    management1 = faker.company.buzzPhrase(),
    management2 = faker.company.buzzPhrase(),
    workSite = faker.company.buzzPhrase(),
    address = faker.location.streetAddress(),
    email = faker.internet.email(),
    phone = '+(502) 45454545',
    vehicles = [this.createVehicleRequest()],
    vehiclesForDelete = []
  }: {
    id?: string;
    employeeCode?: string;
    name?: string;
    workplace?: string;
    identifierDocument?: string;
    company?: string;
    department?: string;
    subManagement?: string;
    management1?: string;
    management2?: string;
    workSite?: string;
    address?: string;
    email?: string;
    phone?: string;
    vehicles?: {
      id?: string;
      vehicleBadge?: string;
      brand?: string;
      model?: string;
      type?: VehicleType;
      color?: string;
    }[];
    vehiclesForDelete?: Array<string>
  } = {}): {
    id?: string;
    employeeCode?: string;
    name?: string;
    workplace?: string;
    identifierDocument?: string;
    company?: string;
    department?: string;
    subManagement?: string;
    management1?: string;
    management2?: string;
    workSite?: string;
    address?: string;
    email?: string;
    phone?: string;
    vehicles?: {
      id?: string;
      vehicleBadge?: string;
      brand?: string;
      model?: string;
      type?: VehicleType;
      color?: string;
    }[];
    vehiclesForDelete?: Array<string>
  } {
    return {
      id,
      employeeCode,
      name,
      workplace,
      identifierDocument,
      company,
      department,
      subManagement,
      management1,
      management2,
      workSite,
      address,
      email,
      phone,
      vehicles,
      vehiclesForDelete
    };
  }

  static createVehicleRequest({
    id,
    vehicleBadge = faker.lorem.word({length: 10}),
    brand = faker.lorem.word({length: 20}),
    model = faker.lorem.word({length: 45}),
    type = VehicleType.CAR,
    color = faker.lorem.word({length: 20})
  }: {
    id?: string;
    vehicleBadge?: string;
    brand?: string;
    model?: string;
    type?: VehicleType;
    color?: string;
  } = {}): {
    id?: string;
    vehicleBadge?: string;
    brand?: string;
    model?: string;
    type?: VehicleType;
    color?: string;
  } {
    return {
      id,
      vehicleBadge,
      color,
      brand,
      model,
      type
    };
  }
}

export class AcceptanceFormRequestMother {
  static createAcceptanceFormRequest({
    headEmployeeData = {
      employeeCode: faker.finance.accountNumber(),
      name: faker.person.fullName(),
      phone: '+(502) 45573001',
      email: faker.internet.email(),
      subManagement: faker.company.buzzPhrase(),
      management1: faker.company.buzzPhrase()
    },
    assignmentDate = '2024-09-13'
  } = {}) {
    return {
      headEmployeeData,
      assignmentDate
    };
  }
}
