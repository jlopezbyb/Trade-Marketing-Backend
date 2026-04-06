import { Router } from 'express';
import { benefitTypeCatalogController } from '../repositories/dependencies';
import { benefitTypeSchema, idSchema } from '../utils/catalogs-schema';
import { validateRequest } from '@src/server/utils/zod-validator';

const routes = Router();

routes
  .post('/', validateRequest(benefitTypeSchema, 'body'), benefitTypeCatalogController.create.bind(benefitTypeCatalogController))
  .get('/', benefitTypeCatalogController.getAll.bind(benefitTypeCatalogController))
  .get('/:id', validateRequest(idSchema, 'params'), benefitTypeCatalogController.getById.bind(benefitTypeCatalogController))
  .put(
    '/:id',
    validateRequest(idSchema, 'params'),
    validateRequest(benefitTypeSchema, 'body'),
    benefitTypeCatalogController.update.bind(benefitTypeCatalogController)
  )
  .delete('/:id', validateRequest(idSchema, 'params'), benefitTypeCatalogController.delete.bind(benefitTypeCatalogController));

export default routes;
