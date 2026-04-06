import { AuthEmployeeRepository } from '@src/contexts/auth copy/infrastructure/repositories/auth-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class RefreshTokenUseCase {
  constructor(private readonly authEmployeeRepository: AuthEmployeeRepository) {}

  async run(email: string) {
    const result = await this.authEmployeeRepository.findUserEmployeeByEmail(email);

    if (!result) throw new AppError('REFRESH_TOKEN_USE_CASE', 401, 'User not found', true);

    const { user, assignmentId } = result;

    return {
      user,
      employeeCode: user.employeeCode,
      assignmentId
    };
  }
}
