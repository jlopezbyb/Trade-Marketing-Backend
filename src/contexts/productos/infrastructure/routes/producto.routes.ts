import { Router } from 'express';
import { productoController } from '../dependencies';
import { validateBody } from '@src/server/middleware/validate-body';
import { createProductoSchema, updateProductoSchema } from '../utils/producto.schema';
import { uploadProductoImage } from '@src/server/middleware/upload.middleware';

const routes = Router();

routes.get('/', productoController.getAll.bind(productoController));
routes.post(
  '/',
  uploadProductoImage.single('image'),
  (req, res, next) => {
    if (req.body.categoria_id) req.body.categoria_id = Number(req.body.categoria_id);
    next();
  },
  validateBody(createProductoSchema),
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
  productoController.update.bind(productoController)
);
routes.delete('/:id', productoController.delete.bind(productoController));

export default routes;
