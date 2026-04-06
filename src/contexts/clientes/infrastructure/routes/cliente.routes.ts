import { Router } from 'express';
import { clienteController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createClienteSchema, updateClienteSchema } from '../utils/cliente.schema';

const routes = Router();

routes.get('/', clienteController.getAll.bind(clienteController));
routes.get('/:id', clienteController.getById.bind(clienteController));
routes.post('/', validateBody(createClienteSchema), clienteController.create.bind(clienteController));
routes.put('/:id', validateBody(updateClienteSchema), clienteController.update.bind(clienteController));
routes.delete('/:id', clienteController.delete.bind(clienteController));

export default routes;
