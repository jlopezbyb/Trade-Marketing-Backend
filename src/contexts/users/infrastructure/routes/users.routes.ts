import { Router } from 'express';
import { usersController } from '../dependencies';

const routes = Router();

routes.get('/', usersController.getAll.bind(usersController));

export default routes;
