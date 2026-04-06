import { Router } from 'express';
import { userController } from '../dependencies';

import { validateRequest } from '@src/server/utils/zod-validator';
import { userSchema } from '../utils/user-zod-schemas';
import { idUserSchema } from '../utils/user-zod-schemas';
import { finderSchema } from '../utils/user-zod-schemas';

const routes = Router();

routes
  .post('/', validateRequest(userSchema, 'body'), userController.create.bind(userController))
  .put(
    '/:user_id',
    validateRequest(idUserSchema, 'params'),
    validateRequest(userSchema.omit({ username: true }), 'body'),
    userController.update.bind(userController)
  )
  .delete('/:user_id', validateRequest(idUserSchema, 'params'), userController.delete.bind(userController))
  .get('/:user_id', validateRequest(idUserSchema, 'params'), userController.getById.bind(userController))
  .get('/', validateRequest(finderSchema, 'query'), userController.getAll.bind(userController));

export default routes;
