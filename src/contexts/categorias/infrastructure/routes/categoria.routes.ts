import { Router } from 'express';
import { categoriaController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createCategoriaSchema, updateCategoriaSchema } from '../utils/categoria.schema';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// field y supervisor pueden consultar categorías
routes.get('/', checkAccessByRole(['field', 'supervisor']), categoriaController.getAll.bind(categoriaController));

// Solo supervisor puede crear/editar/eliminar categorías
routes.post(
  '/',
  validateBody(createCategoriaSchema),
  checkAccessByRole(['supervisor']),
  categoriaController.create.bind(categoriaController)
);
routes.put(
  '/:id',
  validateBody(updateCategoriaSchema),
  checkAccessByRole(['supervisor']),
  categoriaController.update.bind(categoriaController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), categoriaController.delete.bind(categoriaController));

export default routes;
