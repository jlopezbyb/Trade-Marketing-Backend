import { faker } from '@faker-js/faker';
import { SettingEntity } from '../../../src/contexts/parameters/core/entities/setting-entity';
import { SettingModel } from '../../../src/contexts/shared/infrastructure/models/parameter/setting.model';

export class SettingBuilder {
  private _settingEntity: SettingEntity;
  constructor() {
    this._settingEntity = this.createSettingEntity({});
  }

  private createSettingEntity({
    id = faker.string.uuid(),
    settingKey = faker.lorem.word(),
    settingValue = faker.lorem.word(),
    description = faker.lorem.word()
  }: {
    id?: string;
    settingKey?: string;
    settingValue?: string;
    description?: string;
  }): SettingEntity {
    return new SettingEntity(id, settingKey, settingValue, description);
  }

  public withSettingSignaturesForAcceptanceForm(): SettingBuilder {
    this._settingEntity = SettingEntity.fromPrimitives({
      ...this._settingEntity.toPrimitives(),
      settingKey: 'SIGNATURES_FOR_ACCEPTANCE_FORM',
      settingValue:
        '{"security_boss":{"name":"securityBoss","employee_code":"57123456789"},"parking_manager":{"name":"parkingManager","employee_code":"57123456789"},"human_resources_manager":{"name":"humanResourcesManager","employee_code":"57123456789"},"human_resources_payroll":{"name":"humanResourcesPayroll","employee_code":"57123456789"}}',
      description: 'Personal que firma formularios de aceptación'
    });
    return this;
  }

  public withDataFaker(
    data: { settingKey: string; settingValue: string; description: string } = {
      settingKey: faker.lorem.word(),
      settingValue: faker.lorem.word(),
      description: faker.lorem.word()
    }
  ): SettingBuilder {
    this._settingEntity = SettingEntity.fromPrimitives({
      ...this._settingEntity.toPrimitives(),
      ...data,
      id: faker.string.uuid(),
    });
    return this;
  }

  public async build(): Promise<SettingEntity> {
    await SettingModel.create(this._settingEntity.toPrimitives());
    return this._settingEntity;
  }
}
