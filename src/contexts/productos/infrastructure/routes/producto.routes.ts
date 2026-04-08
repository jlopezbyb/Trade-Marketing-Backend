import { Router } from 'express';
import { productoController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createProductoSchema, updateProductoSchema } from '../utils/producto.schema';
import { uploadProductoImage } from '@src/server/middleware/upload.middleware';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

// field y supervisor pueden consultar productos
routes.get('/', checkAccessByRole(['field', 'supervisor']), productoController.getAll.bind(productoController));
routes.post(
  '/',
  uploadProductoImage.single('image'),
  (req, res, next) => {
    if (req.body.categoria_id) req.body.categoria_id = Number(req.body.categoria_id);
    next();
  },
  validateBody(createProductoSchema),
  checkAccessByRole(['supervisor']),
  productoController.create.bind(productoController)
);
routes.put(
  '/:id',
  uploadProductoImage.single('image'),
  (req, res, next) => {
    if (req.body.categoria_id) req.body.categoria_id = Number(req.body.categoria_id);
    next();
  },
  validateBody(updateProductoSchema),
  checkAccessByRole(['supervisor']),
  productoController.update.bind(productoController)
);
routes.delete('/:id', checkAccessByRole(['supervisor']), productoController.delete.bind(productoController));

export default routes;
