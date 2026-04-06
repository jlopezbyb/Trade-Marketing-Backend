import { EmployeeEntity } from '../../core/entities/employee-entity';
import { EmployeeRepository } from '../../core/repositories/employee-repository';

export class GetAllEmployeesUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  public async run(): Promise<EmployeeEntity[] | null> {
    try {
      return await this.employeeRepository.getAllEmployees();
    } catch (error) {
      console.error('Error in run method:', error);
      return null;
    }
  }
}
