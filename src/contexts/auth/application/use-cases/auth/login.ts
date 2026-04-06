import { AuthRepository } from '@src/contexts/auth/core/repository/auth-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async entraLogin(entraData: { email: string }) {
    const userEntity = await this.authRepository.findUserByEmail(entraData.email);
    if (!userEntity) throw new AppError('USER_NOT_FOUND', 401, 'Invalid credentials', true);
    if (!userEntity.activo) throw new AppError('INACTIVE_USER', 401, 'User is inactive', true);

    return { user: userEntity };
  }
}
