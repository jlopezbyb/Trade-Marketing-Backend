import { Router } from 'express';
import { inventarioController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createInventarioSchema } from '../utils/inventario.schema';

const routes = Router();

routes.get('/', inventarioController.getAll.bind(inventarioController));
routes.post('/', validateBody(createInventarioSchema), inventarioController.create.bind(inventarioController));

export default routes;
