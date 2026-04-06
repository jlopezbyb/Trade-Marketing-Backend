import { faker } from "@faker-js/faker";
import { VehicleEntity } from "../../../src/contexts/assignment/core/entities/vehicle-entity";
import { VehicleType } from "../../../src/contexts/location/core/entities/slot-entity";
import { VehicleModel } from "../../../src/contexts/shared/infrastructure/models/assignment/vehicle.model";

export class VehicleBuilder {
  private _vehicleEntity: VehicleEntity;

  constructor() {
    this._vehicleEntity = this.createVehicleEntity({});
  }

  private createVehicleEntity({
    id = faker.string.uuid(),
    vehicleBadge = faker.lorem.word(8),
    brand = faker.lorem.word({length: {min: 10, max: 20}}),
    model = faker.lorem.word({length: {min: 10, max: 20}}),
    type = VehicleType.CAR,
    color = faker.commerce.productMaterial()
  }: {
    id?: string;
    vehicleBadge?: string;
    brand?: string;
    model?: string;
    type?: VehicleType;
    color?: string;
  }): VehicleEntity {
    return new VehicleEntity(id, vehicleBadge, color, brand, model, type);
  }

  public async build(employeeId: string): Promise<VehicleEntity> {
    await VehicleModel.create({...this._vehicleEntity.toPrimitive(), employeeId});
    return this._vehicleEntity;
  }

  public get vehicleEntity(): VehicleEntity {
    return this._vehicleEntity;
  }
}
