import { Router } from 'express';
import { inventarioController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createInventarioSchema, updateInventarioSchema } from '../utils/inventario.schema';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// field y supervisor pueden consultar inventario y registrar movimientos
routes.get('/', checkAccessByRole(['field', 'supervisor']), inventarioController.getAll.bind(inventarioController));
routes.post(
  '/',
  validateBody(createInventarioSchema),
  checkAccessByRole(['field', 'supervisor']),
  inventarioController.create.bind(inventarioController)
);

// Solo supervisor puede modificar o eliminar registros de inventario
routes.put(
  '/:id',
  validateBody(updateInventarioSchema),
  checkAccessByRole(['supervisor']),
  inventarioController.update.bind(inventarioController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), inventarioController.delete.bind(inventarioController));

export default routes;
