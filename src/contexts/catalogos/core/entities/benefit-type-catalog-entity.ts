export class BenefitTypeEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly sendDocument: boolean,
    readonly allowAmount: boolean,
    readonly isActive: boolean
  ) {}

  static fromPrimitive(data: {
    id: string;
    name: string;
    description: string;
    sendDocument: boolean;
    allowAmount: boolean;
    isActive: boolean;
  }) {
    return new BenefitTypeEntity(data.id, data.name, data.description, data.sendDocument, data.allowAmount, data.isActive);
  }

  toPrimitive() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      sendDocument: this.sendDocument,
      allowAmount: this.allowAmount,
      isActive: this.isActive
    };
  }
}
