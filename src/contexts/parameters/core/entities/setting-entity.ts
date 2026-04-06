export class SettingEntity {
  constructor(
    readonly id: string,
    readonly settingKey: string,
    readonly settingValue: string,
    readonly description: string,
    readonly createdAt?: string,
    readonly updatedAt?: string
  ) {}

  static fromPrimitives(plainData: {
    id: string;
    settingKey: string;
    settingValue: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    return new SettingEntity(
      plainData.id,
      plainData.settingKey,
      plainData.settingValue,
      plainData.description,
      plainData.createdAt,
      plainData.updatedAt
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      settingKey: this.settingKey,
      settingValue: this.settingValue,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
