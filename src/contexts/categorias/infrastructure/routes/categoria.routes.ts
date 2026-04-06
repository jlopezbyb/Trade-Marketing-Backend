import { Router } from 'express';
import { categoriaController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createCategoriaSchema, updateCategoriaSchema } from '../utils/categoria.schema';

const routes = Router();

routes.get('/', categoriaController.getAll.bind(categoriaController));
routes.post('/', validateBody(createCategoriaSchema), categoriaController.create.bind(categoriaController));
routes.put('/:id', validateBody(updateCategoriaSchema), categoriaController.update.bind(categoriaController));
routes.delete('/:id', categoriaController.delete.bind(categoriaController));

export default routes;
