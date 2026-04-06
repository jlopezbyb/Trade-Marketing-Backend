import { AuthEmployeeRepository as CoreAuthEmployeeRepository } from './../repositories/auth-repository';
import { UserEmployeeEntity } from '../../core/entities/user-employee-entity';
import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';
//import { AssignmentModel } from '@src/contexts/shared/infrastructure/models/assignment/assignment.model';
import { sequelize } from '@src/server/config/database/sequelize';
import { QueryTypes } from 'sequelize';

export class AuthEmployeeRepository implements CoreAuthEmployeeRepository {
  async findUserEmployeeByEmail(email: string): Promise<{ user: UserEmployeeEntity; assignmentId: string | null } | null> {
    const userDatabase = await EmployeeModel.findOne({
      where: { email },
      include: [
        {
          // model: AssignmentModel,
          as: 'assignment', // este alias debe coincidir con la asociación en tus modelos
          required: false
        }
      ]
    });

    if (!userDatabase) return null;

    const raw = userDatabase.get({ plain: true });

    return {
      user: UserEmployeeEntity.fromPrimitive(raw),
      assignmentId: raw.assignment?.id ?? null
    };
  }

  async hasActiveAssignment(employeeId: string): Promise<boolean> {
    const [result]: any = await sequelize.query('SELECT employee_has_an_active_assignment(:employeeId) as hasAssignment', {
      replacements: { employeeId },
      type: QueryTypes.SELECT
    });

    return result.hasAssignment === 1 || result.hasAssignment === true;
  }
}
