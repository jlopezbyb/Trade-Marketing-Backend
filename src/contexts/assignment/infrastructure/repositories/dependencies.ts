import { AssignmentController } from '../controllers/assignment.controller';

import { SequelizeEmployeeRepository } from '@src/contexts/assignment/infrastructure/repositories/sequelize-employee.repository';
//import { SequelizeMySQLAcceptanceFormRepository } from '@src/contexts/assignment/infrastructure/repositories/sequelize-mysql-acceptance-form-repository';

import { GetEmployeeByNumberUseCase } from '@src/contexts/assignment/application/use-cases/get-employee';
import { GetAllEmployeesUseCase } from '../../application/use-cases/get-all-employees';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employe';

const employeeRepository = new SequelizeEmployeeRepository();
//const assignmentAcceptanceFormRepository = new SequelizeMySQLAcceptanceFormRepository();

//Use cases
const employeeFinderByNumber = new GetEmployeeByNumberUseCase(employeeRepository);
const getAllEmployees = new GetAllEmployeesUseCase(employeeRepository);
const createEmployee = new CreateEmployeeUseCase(employeeRepository);

const assignmentController = new AssignmentController(createEmployee, employeeFinderByNumber, getAllEmployees);
export { assignmentController };
