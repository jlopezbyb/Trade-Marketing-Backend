import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';
import { NotificationPreferenceRepository } from '../../core/repositories/notification-preference-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

interface NotificationPreferenceRequest {
  userId: string;
  preferences: {
    notificationType: string;
    enable: boolean;
  }[];
}

export class SaveNotificationPreferenceUseCase {
  constructor(
    public readonly notificationPreferenceRepository: NotificationPreferenceRepository,
    public readonly userRepository: UserRepository
  ) {}

  async run(data: NotificationPreferenceRequest) {
    const user = await this.userRepository.getById(data.userId);

    if (!user) throw new AppError('USER_NOT_FOUND', 404, 'User not found', true);

    return this.notificationPreferenceRepository.saveNotificationPreferences({
      userId: data.userId,
      preferences: data.preferences
    });
  }
}
