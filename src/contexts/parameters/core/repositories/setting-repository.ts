import { SettingEntity } from '../entities/setting-entity';

export enum SettingKeys {
  WS_EMPLOYEES = 'WS_EMPLOYEES',
  SIGNATURES_FOR_ACCEPTANCE_FORM = 'SIGNATURES_FOR_ACCEPTANCE_FORM',
  MAX_DAYS_TO_ASSIGNMENT_LOAN = 'MAX_DAYS_TO_ASSIGNMENT_LOAN',
  WS_TOKEN = 'WS_TOKEN',
  URL_LDAP = 'URL_LDAP'
}

//TODO: getParameter type string, or json or number
export interface SettingRepository {
  getParameterByKey(key: SettingKeys): Promise<SettingEntity | null>;
  getSettingById(id: string): Promise<SettingEntity | null>;
  getAllSettings(): Promise<Array<SettingEntity>>;
  updateSetting(setting: SettingEntity): Promise<void>;
}
