import { Router } from 'express';
import { visitaController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createVisitaSchema, updateVisitaSchema } from '../utils/visita.schema';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// field y supervisor pueden consultar y crear visitas (historial)
routes.get('/', checkAccessByRole(['field', 'supervisor']), visitaController.getAll.bind(visitaController));
routes.post(
  '/',
  validateBody(createVisitaSchema),
  checkAccessByRole(['field', 'supervisor']),
  visitaController.create.bind(visitaController)
);

// Solo supervisor puede modificar o eliminar visitas
routes.put(
  '/:id',
  validateBody(updateVisitaSchema),
  checkAccessByRole(['supervisor']),
  visitaController.update.bind(visitaController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), visitaController.delete.bind(visitaController));

export default routes;
