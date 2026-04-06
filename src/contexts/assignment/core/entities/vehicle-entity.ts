import { VehicleType } from '@src/contexts/location/core/entities/slot-entity';

export class VehicleEntity {
  constructor(
    public readonly id: string,
    public readonly vehicleBadge: string,
    public readonly color: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly type: VehicleType
  ) {
    this.id = id;
    this.vehicleBadge = vehicleBadge;
    this.color = color;
    this.brand = brand;
    this.model = model;
    this.type = type;
  }

  public static fromPrimitive(primitiveData: {
    id: string;
    vehicleBadge: string;
    color: string;
    brand: string;
    model: string;
    type: VehicleType;
  }) {
    return new VehicleEntity(
      primitiveData.id,
      primitiveData.vehicleBadge,
      primitiveData.color,
      primitiveData.brand,
      primitiveData.model,
      primitiveData.type
    );
  }

  public toPrimitive() {
    return {
      id: this.id,
      vehicleBadge: this.vehicleBadge,
      color: this.color,
      brand: this.brand,
      model: this.model,
      type: this.type
    };
  }
}
