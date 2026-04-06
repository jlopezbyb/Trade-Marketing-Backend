import { Router } from 'express';
import { roleController } from '../dependencies';

import { validateRequest } from '@src/server/utils/zod-validator';
import { roleSchema } from '../utils/role-zod-schemas';
import { idRoleSchema } from '../utils/role-zod-schemas';
import { finderSchema } from '../utils/role-zod-schemas';

const routes = Router();

routes
  .post('/', validateRequest(roleSchema, 'body'), roleController.create.bind(roleController))
  .put(
    '/:role_id',
    validateRequest(idRoleSchema, 'params'),
    validateRequest(roleSchema, 'body'),
    roleController.update.bind(roleController)
  )
  .delete('/:role_id', validateRequest(idRoleSchema, 'params'), roleController.delete.bind(roleController))
  .get('/resources', roleController.getAllResources.bind(roleController))
  .get('/:role_id', validateRequest(idRoleSchema, 'params'), roleController.getById.bind(roleController))
  .get('/', validateRequest(finderSchema, 'query'), roleController.getAll.bind(roleController));

export default routes;
