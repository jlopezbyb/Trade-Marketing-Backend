import { Router } from 'express';
import { productoController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createProductoSchema, updateProductoSchema } from '../utils/producto.schema';

const routes = Router();

routes.get('/', productoController.getAll.bind(productoController));
routes.post('/', validateBody(createProductoSchema), productoController.create.bind(productoController));
routes.put('/:id', validateBody(updateProductoSchema), productoController.update.bind(productoController));
routes.delete('/:id', productoController.delete.bind(productoController));

export default routes;
