import { SettingModel } from '../../../src/contexts/shared/infrastructure/models/parameter/setting.model';


export interface SettingTableResult {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class ParametersHelper {
  static async getAllSettings(): Promise<SettingTableResult[]> {
    const result = await SettingModel.findAll();
    return result.map(setting => ({...setting.get({ plain: true })}));
  }

  static async getSettingByKey(key: string): Promise<SettingTableResult | null> {
    const result = await SettingModel.findOne({ where: { settingKey: key } });
    if (!result) return null;
    return {...result.get({ plain: true })};
  }

  static async deleteAllSettings(): Promise<void> {
    await SettingModel.destroy({truncate: true});
  }
}
