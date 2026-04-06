export class VehicleTypeEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly isActive: boolean
  ) {}

  static fromPrimitives(data: { id: string; name: string; description: string; isActive: boolean }) {
    return new VehicleTypeEntity(data.id, data.name, data.description, data.isActive);
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive
    };
  }
}
