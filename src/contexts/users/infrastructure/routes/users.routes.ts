import { Router } from 'express';
import { usersController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createUserSchema, updateUserSchema, asignarClientesSchema } from '../utils/users.schema';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// Solo supervisor puede administrar usuarios
routes.get('/', checkAccessByRole(['supervisor']), usersController.getAll.bind(usersController));
routes.get('/:id', checkAccessByRole(['supervisor']), usersController.getById.bind(usersController));
routes.post('/', validateBody(createUserSchema), checkAccessByRole(['supervisor']), usersController.create.bind(usersController));
routes.put(
  '/:id',
  validateBody(updateUserSchema),
  checkAccessByRole(['supervisor']),
  usersController.update.bind(usersController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), usersController.delete.bind(usersController));

// Asignación de clientes
// - supervisor puede ver los clientes de cualquier usuario
// - field solo puede ver sus propios clientes (se fuerza en el controlador)
routes.get(
  '/:id/clientes',
  checkAccessByRole(['supervisor', 'field']),
  usersController.getClientesAsignados.bind(usersController)
);
routes.put(
  '/:id/clientes',
  validateBody(asignarClientesSchema),
  checkAccessByRole(['supervisor']),
  usersController.asignarClientes.bind(usersController)
);

export default routes;
