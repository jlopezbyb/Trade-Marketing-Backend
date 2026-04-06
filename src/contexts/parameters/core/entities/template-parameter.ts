export class TemplateParameterEntity {
  constructor(
    readonly id: string,
    readonly parameterName: string,
    readonly parameterDescription: string,
    readonly exampleValue: string,
    readonly entity: string,
    readonly columnName: string
  ) {}

  static fromPrimitive(data: {
    id: string;
    parameterName: string;
    parameterDescription: string;
    exampleValue: string;
    entity: string;
    columnName: string;
  }): TemplateParameterEntity {
    return new TemplateParameterEntity(
      data.id,
      data.parameterName,
      data.parameterDescription,
      data.exampleValue,
      data.entity,
      data.columnName
    );
  }

  toPrimitive() {
    return {
      id: this.id,
      parameterName: this.parameterName,
      parameterDescription: this.parameterDescription,
      exampleValue: this.exampleValue,
      entity: this.entity,
      columnName: this.columnName
    };
  }
}
