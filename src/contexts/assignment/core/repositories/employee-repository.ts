import { EmployeeEntity } from '../entities/employee-entity';

export interface EmployeeRepository {
  createEmployee(employee: EmployeeEntity): Promise<void>;
  getEmployeeByNumberUseCase(employeeNumber: string): Promise<EmployeeEntity>;
  getAllEmployees(): Promise<EmployeeEntity[]>;
}
