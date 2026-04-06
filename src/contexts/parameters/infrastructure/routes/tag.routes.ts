import { Router } from 'express';
import { tagController } from '../repositories/dependencies';

import { validateRequest } from '@src/server/utils/zod-validator';
import { idTagSchema } from '../utils/tag-zod-schemas';
import { tagSchema } from '../utils/tag-zod-schemas';
import { finderSchema } from '../utils/tag-zod-schemas';

const routes = Router();

routes
  .post('/', validateRequest(tagSchema, 'body'), tagController.create.bind(tagController))
  .put(
    '/:tag_id',
    validateRequest(idTagSchema, 'params'),
    validateRequest(tagSchema, 'body'),
    tagController.update.bind(tagController)
  )
  .delete('/:tag_id', validateRequest(idTagSchema, 'params'), tagController.delete.bind(tagController))
  .get('/', validateRequest(finderSchema, 'query'), tagController.getAll.bind(tagController))
  .get('/:tag_id', validateRequest(idTagSchema, 'params'), tagController.getById.bind(tagController));

export default routes;
