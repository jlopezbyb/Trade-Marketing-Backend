import { Router } from 'express';
import { reportesController } from '../dependencies';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// Solo supervisor puede ver reportes
routes.get(
  '/inventario-estancado',
  checkAccessByRole(['supervisor']),
  reportesController.inventarioEstancado.bind(reportesController)
);
routes.get(
  '/productos-por-vencer',
  checkAccessByRole(['supervisor']),
  reportesController.productosPorVencer.bind(reportesController)
);
routes.get('/summary', checkAccessByRole(['supervisor']), reportesController.summary.bind(reportesController));

export default routes;
