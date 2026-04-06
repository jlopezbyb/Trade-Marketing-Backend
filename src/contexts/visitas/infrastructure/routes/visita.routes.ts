import { Router } from 'express';
import { visitaController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createVisitaSchema } from '../utils/visita.schema';

const routes = Router();

routes.get('/', visitaController.getAll.bind(visitaController));
routes.post('/', validateBody(createVisitaSchema), visitaController.create.bind(visitaController));

export default routes;
