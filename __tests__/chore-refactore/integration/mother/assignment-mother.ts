import { faker } from '@faker-js/faker';

export class AssignmentMotherRequest {
  static createAssignmentRequest({
    slotId = faker.string.uuid(),
    parkingCardNumber = faker.finance.accountNumber(),
    employee = {
      employeeCode: faker.finance.bic(),
      name: faker.person.fullName(),
      workplace: faker.company.buzzPhrase(),
      identifierDocument: faker.finance.accountNumber(),
      company: faker.company.name(),
      department: faker.company.buzzVerb(),
      subManagement: faker.company.buzzVerb(),
      management1: faker.company.buzzVerb(),
      management2: faker.company.buzzVerb(),
      workSite: faker.company.buzzVerb(),
      address: faker.location.streetAddress(),
      email: faker.internet.email(),
      phone: '+(502) 45555555',
      vehicles: [
        {
          vehicleBadge: faker.vehicle.vrm(),
          color: faker.vehicle.color(),
          brand: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          type: 'CARRO'
        }
      ]
    },
    tags = []
  }): {
    slotId: string;
    parkingCardNumber: string;
    employee: {
      employeeCode: string;
      name: string;
      workplace: string;
      identifierDocument: string;
      company: string;
      department: string;
      subManagement: string;
      management1: string;
      management2: string;
      workSite: string;
      address: string;
      email: string;
      phone: string;
      vehicles: {
        vehicleBadge: string;
        color: string;
        brand: string;
        model: string;
        type: string;
      }[];
    };
    tags: string[];
  } {
    return {
      slotId,
      parkingCardNumber,
      employee,
      tags
    };
  }
}
