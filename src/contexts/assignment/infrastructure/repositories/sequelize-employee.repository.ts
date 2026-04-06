/* eslint-disable prettier/prettier */
import { EmployeeRepository } from '@src/contexts/assignment/core/repositories/employee-repository';

import { EmployeeEntity } from '@src/contexts/assignment/core/entities/employee-entity';

import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';
import { UniqueConstraintError, ValidationError } from 'sequelize';

import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
//import { parseStringPromise } from 'xml2js';

export class SequelizeEmployeeRepository implements EmployeeRepository {
  async createEmployee(employee: EmployeeEntity): Promise<void> {
    try {
      await EmployeeModel.create(employee.toPrimitive());
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const duplicatedFields = error.errors
          .map(item => item.path)
          .filter((field): field is string => Boolean(field));

        if (duplicatedFields.includes('employee_number') || duplicatedFields.includes('employeeNumber')) {
          throw new AppError(
            'EL_EMPLEADO_YA_EXISTE',
            400,
            `Employee number ${employee.employeeNumber} already exists`,
            true
          );
        }

        if (duplicatedFields.includes('id')) {
          throw new AppError(
            'EL_EMPLEADO_YA_EXISTE',
            400,
            `Employee id ${employee.id} already exists`,
            true
          );
        }

        throw new AppError(
          'EL_EMPLEADO_YA_EXISTE',
          400,
          'Employee already exists with unique data provided',
          true
        );
      }

      if (error instanceof ValidationError) {
        const validationMessages = error.errors.map(item => item.message).join(', ');
        throw new AppError('DATOS_DEL_EMPLEADO_INVALIDOS', 400, validationMessages || 'Employee data is invalid', true);
      }

      throw new AppError(
        'FALLO_CREACION_EMPLEADO',
        500,
        'Unexpected error while creating employee',
        true
      );
    }
  }

  async getAllEmployees(): Promise<EmployeeEntity[]> {
    const employees = await EmployeeModel.findAll({
    });

    return employees.map(employee => EmployeeEntity.fromPrimitive(employee.get({ plain: true })));
  }
  
 async getEmployeeByNumberUseCase(employeeNumber: string): Promise<EmployeeEntity> {
    const employee = await EmployeeModel.findOne({
      where: {
        employee_number: employeeNumber
      },
    });

    if (!employee) {
      throw new AppError('Employee not found', 404, `No employee found with number: ${employeeNumber}`, true);
    }

    return EmployeeEntity.fromPrimitive(employee.get({ plain: true }));
  }
}
