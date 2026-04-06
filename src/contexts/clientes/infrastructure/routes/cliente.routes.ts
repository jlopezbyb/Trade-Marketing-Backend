import { Router } from 'express';
import { clienteController } from '../dependencies';

const routes = Router();

routes.get('/', clienteController.getAll.bind(clienteController));

export default routes;
