import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { EmployeeRepository } from '../../core/repositories/employee-repository';
import { EmployeeEntity } from '@src/contexts/assignment/core/entities/employee-entity';

export class GetEmployeeByNumberUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async run(employeeNumber: string) {
    let employee: EmployeeEntity;
    try {
      employee = await this.employeeRepository.getEmployeeByNumberUseCase(employeeNumber);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw error;
    }
    return { ...employee.toPrimitive() };
  }
}
