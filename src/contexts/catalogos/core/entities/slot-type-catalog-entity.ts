export class SlotTypeEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly allowParallelAssignments: boolean,
    readonly isActive: boolean
  ) {}

  static fromPrimitives(data: {
    id: string;
    name: string;
    description: string;
    allowParallelAssignments: boolean;
    isActive: boolean;
  }) {
    return new SlotTypeEntity(data.id, data.name, data.description, data.allowParallelAssignments, data.isActive);
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      allowParallelAssignments: this.allowParallelAssignments,
      isActive: this.isActive
    };
  }
}
