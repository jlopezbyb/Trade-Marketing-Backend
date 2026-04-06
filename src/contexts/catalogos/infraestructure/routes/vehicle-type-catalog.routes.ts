import { Router } from 'express';
import { vehicleTypeCatalogController } from '../repositories/dependencies';
import { idSchema, vehicleTypeSchema } from '../utils/catalogs-schema';
import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .post('/', validateRequest(vehicleTypeSchema, 'body'), vehicleTypeCatalogController.create.bind(vehicleTypeCatalogController))
  .get('/', vehicleTypeCatalogController.getAll.bind(vehicleTypeCatalogController))
  .get('/:id', validateRequest(idSchema, 'params'), vehicleTypeCatalogController.getById.bind(vehicleTypeCatalogController))
  .put(
    '/:id',
    validateRequest(idSchema, 'params'),
    validateRequest(vehicleTypeSchema, 'body'),
    vehicleTypeCatalogController.update.bind(vehicleTypeCatalogController)
  )
  .delete('/:id', validateRequest(idSchema, 'params'), vehicleTypeCatalogController.delete.bind(vehicleTypeCatalogController));

export default routes;
