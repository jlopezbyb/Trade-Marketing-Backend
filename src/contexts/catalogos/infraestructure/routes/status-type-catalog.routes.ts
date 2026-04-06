import { Router } from 'express';
import { statusTypeCatalogController } from '../repositories/dependencies';
import { idSchema, StatusTypeSchema } from '../utils/catalogs-schema';
import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .post('/', validateRequest(StatusTypeSchema, 'body'), statusTypeCatalogController.create.bind(statusTypeCatalogController))
  .get('/', statusTypeCatalogController.getAll.bind(statusTypeCatalogController))
  .get('/:id', validateRequest(idSchema, 'params'), statusTypeCatalogController.getById.bind(statusTypeCatalogController))
  .put(
    '/:id',
    validateRequest(idSchema, 'params'),
    validateRequest(StatusTypeSchema, 'body'),
    statusTypeCatalogController.update.bind(statusTypeCatalogController)
  )
  .delete('/:id', validateRequest(idSchema, 'params'), statusTypeCatalogController.delete.bind(statusTypeCatalogController));

export default routes;
