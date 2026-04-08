import { Router } from 'express';
import { clienteController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createClienteSchema, updateClienteSchema } from '../utils/cliente.schema';
import { uploadClienteImage } from '@src/server/middleware/upload.middleware';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// field y supervisor pueden consultar clientes
routes.get('/', checkAccessByRole(['field', 'supervisor']), clienteController.getAll.bind(clienteController));
routes.get('/:id', checkAccessByRole(['field', 'supervisor']), clienteController.getById.bind(clienteController));
routes.post(
  '/',
  uploadClienteImage.single('imagen'),
  (req, res, next) => {
    next();
  },
  validateBody(createClienteSchema),
  checkAccessByRole(['supervisor']),
  clienteController.create.bind(clienteController)
);
routes.put(
  '/:id',
  uploadClienteImage.single('imagen'),
  (req, res, next) => {
    next();
  },
  validateBody(updateClienteSchema),
  checkAccessByRole(['supervisor']),
  clienteController.update.bind(clienteController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), clienteController.delete.bind(clienteController));

export default routes;
