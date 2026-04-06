import { Router } from 'express';
import { settingController } from '../repositories/dependencies';

import { idSettingSchema, settingUpdateSchema } from '../utils/setting-zod-schema';

import { validateRequest } from '@src/server/utils/zod-validator';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

routes
  .get('/', checkAccessByRole(['management-parameters']), settingController.getAll.bind(settingController))
  .get(
    '/:setting_id',
    checkAccessByRole(['management-parameters', 'employee']),
    validateRequest(idSettingSchema, 'params'),
    settingController.getById.bind(settingController)
  )
  .patch(
    '/:setting_id',
    validateRequest(settingUpdateSchema, 'body'),
    validateRequest(idSettingSchema, 'params'),
    checkAccessByRole(['management-parameters']),
    settingController.update.bind(settingController)
  );

export default routes;
