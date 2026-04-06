import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';
import { UserEmployeeEntity } from '../entities/user-employee-entity';

export interface AuthEmployeeRepository {
  findUserEmployeeByEmail(email: string): Promise<UserEmployeeEntity | null>;
  getByEmailOrUsername(email: string, username: string): Promise<UserEntity | null>;
  hasActiveAssignment(employeeId: string): Promise<boolean>;
}
