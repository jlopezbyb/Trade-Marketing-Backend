import { faker } from "@faker-js/faker";
import { EmployeeEntity, TokenStatus } from "../../../src/contexts/assignment/core/entities/employee-entity";
import { VehicleEntity } from "../../../src/contexts/assignment/core/entities/vehicle-entity";
import { EmployeeModel } from "../../../src/contexts/shared/infrastructure/models/assignment/employee.model";

export class EmployeeBuilder{
  private _employeeEntity: EmployeeEntity;

  constructor() {
    this._employeeEntity = this.createEmployeeEntity({});
  }

  private createEmployeeEntity({
    id = faker.string.uuid(),
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
    phone = "+(502) 45454545",
    vehicles = [],
    accessToken,
    accessTokenStatus
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
    vehicles?: VehicleEntity[];
    accessToken?: string;
    accessTokenStatus?: TokenStatus;
  }): EmployeeEntity {
    return new EmployeeEntity(
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
      accessToken,
      accessTokenStatus
    );
  }

  public async build(): Promise<EmployeeEntity> {
    try {

      await EmployeeModel.create(this._employeeEntity.toPrimitive());
    } catch (error) {
      console.log(error);
    }
    return this._employeeEntity;
  }

  public get employeeEntity(): EmployeeEntity{
    return this._employeeEntity;
  }

}
