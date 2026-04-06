import { SettingRepository } from '../../core/repositories/setting-repository';

export class GetAllSettingsUseCase {
  constructor(private readonly repository: SettingRepository) {}

  async run() {
    const settings = await this.repository.getAllSettings();
    return settings.map(setting => setting.toPrimitives());
  }
}
