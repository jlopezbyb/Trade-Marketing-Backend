import { AuthEmployeeRepository } from '@src/contexts/auth copy/infrastructure/repositories/auth-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class LoginEmployeeUseCase {
  constructor(private readonly authEmployeeRepository: AuthEmployeeRepository) {}

  async entraLogin(entraData: { email: string }) {
    const result = await this.authEmployeeRepository.findUserEmployeeByEmail(entraData.email);

    if (!result) {
      throw new AppError('USER_NOT_FOUND', 401, 'Invalid credentials', true);
    }

    const { user, assignmentId } = result;

    const hasActiveAssignment = await this.authEmployeeRepository.hasActiveAssignment(user.id);

    if (!hasActiveAssignment) {
      throw new AppError('NO_ACTIVE_ASSIGNMENT', 403, 'El usuario no tiene una asignación activa', true);
    }

    return {
      user,
      employeeCode: user.employeeCode,
      assignmentId,
      type: 'employee'
    };
  }
}
