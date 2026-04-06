import { Router } from 'express';
import { slotTypeCatalogController } from '../repositories/dependencies';
import { idSchema, slotTypeSchema } from '../utils/catalogs-schema';
import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .post('/', validateRequest(slotTypeSchema, 'body'), slotTypeCatalogController.create.bind(slotTypeCatalogController))
  .get('/', slotTypeCatalogController.getAll.bind(slotTypeCatalogController))
  .get('/:id', validateRequest(idSchema, 'params'), slotTypeCatalogController.getById.bind(slotTypeCatalogController))
  .put(
    '/:id',
    validateRequest(idSchema, 'params'),
    validateRequest(slotTypeSchema, 'body'),
    slotTypeCatalogController.update.bind(slotTypeCatalogController)
  )
  .delete('/:id', validateRequest(idSchema, 'params'), slotTypeCatalogController.delete.bind(slotTypeCatalogController));

export default routes;
