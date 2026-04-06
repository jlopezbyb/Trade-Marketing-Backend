import { Router } from 'express';

import { assignmentController } from '../repositories/dependencies';

const routes = Router();

// Employee
routes
  // .get(
  //   '/employee',
  //   validateAuth(),
  //   checkAccessByRole(['assign-parking', 'employee']),
  //   validateRequest(getAssignmentsSchemaForQuery, 'query'),
  //   assignmentController.getAllEmployees.bind(assignmentController)
  // )
  .get(
    '/employee/:employee_number',
    // validateAuth(),
    // checkAccessByRole(['assign-parking', 'employee']),
    // validateRequest(getAssignmentsSchemaForQuery, 'query'),
    assignmentController.employeeFinderByNumber.bind(assignmentController)
  )
  .get(
    '/employee',
    // validateAuth(),
    // checkAccessByRole(['assign-parking', 'employee']),
    // validateRequest(getAssignmentsSchemaForQuery, 'query'),
    assignmentController.getAllEmployees.bind(assignmentController)
  )
  .post('/employee', assignmentController.createEmployee.bind(assignmentController));

export default routes;
