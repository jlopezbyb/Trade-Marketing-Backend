import { Router } from 'express';
import { visitaController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createVisitaSchema, updateVisitaSchema } from '../utils/visita.schema';

const routes = Router();

routes.get('/', visitaController.getAll.bind(visitaController));
routes.post('/', validateBody(createVisitaSchema), visitaController.create.bind(visitaController));
routes.put('/:id', validateBody(updateVisitaSchema), visitaController.update.bind(visitaController));
routes.delete('/:id', visitaController.delete.bind(visitaController));

export default routes;
