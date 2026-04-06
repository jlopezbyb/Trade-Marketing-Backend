import { Router } from 'express';
import { usersController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createUserSchema, updateUserSchema, asignarClientesSchema } from '../utils/users.schema';

const routes = Router();

routes.get('/', usersController.getAll.bind(usersController));
routes.get('/:id', usersController.getById.bind(usersController));
routes.post('/', validateBody(createUserSchema), usersController.create.bind(usersController));
routes.put('/:id', validateBody(updateUserSchema), usersController.update.bind(usersController));
routes.delete('/:id', usersController.delete.bind(usersController));

// Asignación de clientes
routes.get('/:id/clientes', usersController.getClientesAsignados.bind(usersController));
routes.put('/:id/clientes', validateBody(asignarClientesSchema), usersController.asignarClientes.bind(usersController));

export default routes;
