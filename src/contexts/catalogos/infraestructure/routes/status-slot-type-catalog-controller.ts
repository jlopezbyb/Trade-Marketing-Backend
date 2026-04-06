import { Router } from 'express';
import { statusSlotTypeCatalogController } from '../repositories/dependencies';
import { idSchema, StatusSlotTypeSchema } from '../utils/catalogs-schema';
import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .post(
    '/',
    validateRequest(StatusSlotTypeSchema, 'body'),
    statusSlotTypeCatalogController.create.bind(statusSlotTypeCatalogController)
  )
  .get('/', statusSlotTypeCatalogController.getAll.bind(statusSlotTypeCatalogController))
  .get('/:id', validateRequest(idSchema, 'params'), statusSlotTypeCatalogController.getById.bind(statusSlotTypeCatalogController))
  .put(
    '/:id',
    validateRequest(idSchema, 'params'),
    validateRequest(StatusSlotTypeSchema, 'body'),
    statusSlotTypeCatalogController.update.bind(statusSlotTypeCatalogController)
  )
  .delete(
    '/:id',
    validateRequest(idSchema, 'params'),
    statusSlotTypeCatalogController.delete.bind(statusSlotTypeCatalogController)
  );

export default routes;
