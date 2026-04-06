import { Router } from 'express';
import { reportesController } from '../dependencies';

const routes = Router();

routes.get('/inventario-estancado', reportesController.inventarioEstancado.bind(reportesController));
routes.get('/productos-por-vencer', reportesController.productosPorVencer.bind(reportesController));
routes.get('/summary', reportesController.summary.bind(reportesController));

export default routes;
