import { Router } from 'express';
import { reportsController } from '../repositories/dependencies';
import { validateRequest } from '@src/server/utils/zod-validator';
import { getAssignedParkingByPeriodQuerySchema, PaginationQuerySchema } from '../utils/reports-zod-schemas';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

routes.get(
  '/locations',
  checkAccessByRole(['management-reports', 'dashboard']),
  validateRequest(PaginationQuerySchema, 'query'),
  reportsController.getLocationsReport.bind(reportsController)
);

routes.get(
  '/collaborators',
  checkAccessByRole(['management-reports']),
  validateRequest(PaginationQuerySchema, 'query'),
  reportsController.getDetailsReportByCollaborator.bind(reportsController)
);

routes.get(
  '/details-with-cost',
  checkAccessByRole(['management-reports']),
  validateRequest(PaginationQuerySchema, 'query'),
  reportsController.getDetailReportByCollaboratorWithCost.bind(reportsController)
);

routes.get(
  '/assigned-parking-spots',
  checkAccessByRole(['management-reports']),
  validateRequest(getAssignedParkingByPeriodQuerySchema, 'query'),
  reportsController.getAssignedParkingByPeriod.bind(reportsController)
);

export default routes;
