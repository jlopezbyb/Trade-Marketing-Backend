import { Router } from 'express';
import { productoController } from '../dependencies';

const routes = Router();

routes.get('/', productoController.getAll.bind(productoController));

export default routes;
