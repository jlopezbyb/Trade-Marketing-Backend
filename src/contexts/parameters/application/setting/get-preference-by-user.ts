import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';
import { NotificationPreferenceRepository } from '../../core/repositories/notification-preference-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class GetPreferenceNotificationByUserUseCase {
  constructor(
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
    private readonly userRepository: UserRepository
  ) {}

  async run(userId: string) {
    const user = await this.userRepository.getById(userId);

    if (!user) throw new AppError('USER_NOT_FOUND', 404, 'User not found', true);

    return this.notificationPreferenceRepository.getNotificationPreferencesByUser(userId);
  }
}
