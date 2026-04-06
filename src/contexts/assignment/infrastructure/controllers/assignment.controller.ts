import { Request, Response } from 'express';
import { NextFunction } from 'express';
import { GetEmployeeByNumberUseCase } from '@src/contexts/assignment/application/use-cases/get-employee';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { GetAllEmployeesUseCase } from '@src/contexts/assignment/application/use-cases/get-all-employees';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employe';
import WinstonLogger from '@src/contexts/shared/infrastructure/WinstonLogger';

export class AssignmentController {
  private readonly logger: WinstonLogger;

  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getEmployeeByNumberUseCase: GetEmployeeByNumberUseCase,
    private readonly getAllEmployeesUseCase: GetAllEmployeesUseCase
  ) {
    this.logger = new WinstonLogger();
  }

  async createEmployee(req: Request, res: Response, next: NextFunction) {
    const employeeData = req.body;
    try {
      const employee = await this.createEmployeeUseCase.run(employeeData);
      const response = {
        data: employee
      };
      res.status(201).json(response);
      this.logger.info(`Employee created successfully with employeeNumber ${employee.employeeNumber}`);
    } catch (error) {
      if (error instanceof AppError) {
        this.logger.warn(`Error creating employee [${error.name}]: ${error.message}`);
        return next(error);
      }

      if (error instanceof Error) {
        this.logger.error(error);
      } else {
        this.logger.error('Unknown error creating employee');
      }

      return next(new AppError('EMPLOYEE_CREATION_FAILED', 500, 'An error occurred while creating employee', true));
    }
  }

  async employeeFinderByNumber(req: Request, res: Response, next: NextFunction) {
    const employeeNumber = req.params.employee_number;

    try {
      const employee = await this.getEmployeeByNumberUseCase.run(employeeNumber);
      const response = {
        data: employee
      };

      res.status(200).json(response);
      this.logger.info(`Employee with number ${employeeNumber} retrieved successfully: %o`);
    } catch (error) {
      next(new AppError('Failed to retrieve employees', 500, 'An error occurred while fetching employees', true));
      console.info('Error retrieving employees:', error);
      this.logger.error('Error retrieving employees');
    }
  }

  async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await this.getAllEmployeesUseCase.run();
      const response = {
        data: employee
      };
      res.status(200).json(response);
      this.logger.info('All employees retrieved successfully');
    } catch (error) {
      next(new AppError('Failed to retrieve employees', 500, 'An error occurred while fetching employees', true));
      this.logger.error('Error retrieving employees: %o');
    }
  }
}
