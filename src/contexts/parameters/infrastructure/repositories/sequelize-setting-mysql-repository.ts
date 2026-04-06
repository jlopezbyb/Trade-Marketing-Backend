import { SettingEntity } from '@src/contexts/parameters/core/entities/setting-entity';
import { SettingRepository } from '@src/contexts/parameters/core/repositories/setting-repository';
import { SettingKeys } from '@src/contexts/parameters/core/repositories/setting-repository';
import { SettingModel } from '@src/contexts/shared/infrastructure/models/parameter/setting.model';

export class SequelizeSettingMySQLRepository implements SettingRepository {
  async getParameterByKey(key: SettingKeys): Promise<SettingEntity | null> {
    const settingDatabase = await SettingModel.findOne({
      where: { setting_key: key }
    });

    if (!settingDatabase) {
      return null;
    }

    return SettingEntity.fromPrimitives(settingDatabase.get({ plain: true }));
  }

  async getSettingById(id: string): Promise<SettingEntity | null> {
    const settingDatabase = await SettingModel.findByPk(id);
    if (!settingDatabase) {
      return null;
    }
    const plainSetting = settingDatabase.get({ plain: true });
    return SettingEntity.fromPrimitives({
      ...plainSetting,
      createdAt: plainSetting.created_at,
      updatedAt: plainSetting.updated_at
    });
  }

  async getAllSettings(): Promise<Array<SettingEntity>> {
    const settingsDatabase = await SettingModel.findAll();
    return settingsDatabase.map(setting => {
      const plainSetting = setting.get({ plain: true });
      return SettingEntity.fromPrimitives({
        ...plainSetting,
        createdAt: plainSetting.created_at,
        updatedAt: plainSetting.updated_at
      });
    });
  }

  async updateSetting(setting: SettingEntity): Promise<void> {
    await SettingModel.update(setting.toPrimitives(), {
      where: { id: setting.id },
      fields: ['settingValue', 'description']
    });
  }
}
