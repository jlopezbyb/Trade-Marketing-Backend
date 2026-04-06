import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { SettingRepository } from '../../core/repositories/setting-repository';

export class GetByIdSettingUseCase {
  constructor(private readonly repository: SettingRepository) {}

  async run(id: string) {
    const setting = await this.repository.getSettingById(id);

    if (!setting) {
      throw new AppError('SETTING_NOT_FOUND', 404, 'Setting not found', true);
    }

    return setting.toPrimitives();
  }
}
