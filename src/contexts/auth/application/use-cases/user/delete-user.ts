import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string) {
    const userDatabase = await this.userRepository.getById(id);

    if (!userDatabase) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found', true);
    }

    await this.userRepository.delete(id);
  }
}
