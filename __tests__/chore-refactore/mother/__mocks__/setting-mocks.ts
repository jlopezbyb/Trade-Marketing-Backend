import { SettingRepository } from '../../src/parameters/core/repositories/setting-repository';

export const mockSettingRepository: jest.Mocked<SettingRepository> = {
  getParameterByKey: jest.fn().mockReturnValue(null),
}
