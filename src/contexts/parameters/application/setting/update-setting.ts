import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { SettingRepository } from '../../core/repositories/setting-repository';
import { SettingEntity } from '../../core/entities/setting-entity';

export class UpdateSettingUseCase {
  constructor(private readonly repository: SettingRepository) {}

  async run(data: { settingId: string; settingValue: string; description: string }) {
    const settingDatabase = await this.repository.getSettingById(data.settingId);

    if (!settingDatabase) {
      throw new AppError('SETTING_NOT_FOUND', 404, 'Setting not found', true);
    }

    const setting = SettingEntity.fromPrimitives({
      id: settingDatabase.id,
      settingKey: settingDatabase.settingKey,
      settingValue: data.settingValue,
      description: data.description
    });
    await this.repository.updateSetting(setting);
  }
}
