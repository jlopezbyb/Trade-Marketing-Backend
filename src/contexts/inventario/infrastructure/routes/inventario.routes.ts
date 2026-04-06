import { Router } from 'express';
import { inventarioController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createInventarioSchema, updateInventarioSchema } from '../utils/inventario.schema';

const routes = Router();

routes.get('/', inventarioController.getAll.bind(inventarioController));
routes.post('/', validateBody(createInventarioSchema), inventarioController.create.bind(inventarioController));
routes.put('/:id', validateBody(updateInventarioSchema), inventarioController.update.bind(inventarioController));
routes.delete('/:id', inventarioController.delete.bind(inventarioController));

export default routes;
