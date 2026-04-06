import { Router } from 'express';
import { categoriaController } from '../dependencies';

const routes = Router();

routes.get('/', categoriaController.getAll.bind(categoriaController));

export default routes;
