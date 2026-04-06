import { EmployeeEntity } from '../../core/entities/employee-entity';
import { EmployeeRepository } from '../../core/repositories/employee-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

type CreateEmployeeInput = {
  id: string;
  employeeNumber: string;
  name?: string | null;
  dpi?: string | null;
  nit?: string | null;
  company?: string | null;
  departmentCode?: string | null;
  department?: string | null;
  areaCode?: string | null;
  area?: string | null;
  positionCode?: string | null;
  position?: string | null;
  employeeType?: string | null;
  companyEmail?: string | null;
  managerEmployeeNumber?: string | null;
  costCenter?: string | null;
  globalDimensionCode?: string | null;
  supplierNumber?: string | null;
  preferredBankAccountCode?: string | null;
  statisticsGroupCode?: string | null;
};

export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async run(employeeData: CreateEmployeeInput): Promise<EmployeeEntity> {
    if (!employeeData.id || !employeeData.id.trim()) {
      throw new AppError('INVALID_EMPLOYEE_DATA', 400, 'Employee id is required', true);
    }

    if (!employeeData.employeeNumber || !employeeData.employeeNumber.trim()) {
      throw new AppError('INVALID_EMPLOYEE_DATA', 400, 'Employee number is required', true);
    }

    const employee = EmployeeEntity.fromPrimitive(employeeData);

    await this.employeeRepository.createEmployee(employee);

    return employee;
  }
}
