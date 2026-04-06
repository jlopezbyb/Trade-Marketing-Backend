import { Router } from 'express';
import authRoutes from '@src/contexts/auth/infrastructure/routes/auth.routes';
import clienteRoutes from '@src/contexts/clientes/infrastructure/routes/cliente.routes';
import categoriaRoutes from '@src/contexts/categorias/infrastructure/routes/categoria.routes';
import productoRoutes from '@src/contexts/productos/infrastructure/routes/producto.routes';
import usersRoutes from '@src/contexts/users/infrastructure/routes/users.routes';
import visitaRoutes from '@src/contexts/visitas/infrastructure/routes/visita.routes';
import inventarioRoutes from '@src/contexts/inventario/infrastructure/routes/inventario.routes';
import reportesRoutes from '@src/contexts/reportes/infrastructure/routes/reportes.routes';
import { validateAuth } from '@server/middleware/auth-middleware';

// Import trade model relations
import '@src/contexts/shared/infrastructure/models/trade/trade-relations';

const routes = Router();

routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

// Auth
routes.use('/api/v1/auth', authRoutes);

// Trade Marketing API — protected routes
routes.use('/api/v1/clientes', validateAuth(), clienteRoutes);
routes.use('/api/v1/categorias', validateAuth(), categoriaRoutes);
routes.use('/api/v1/productos', validateAuth(), productoRoutes);
routes.use('/api/v1/users', validateAuth(), usersRoutes);
routes.use('/api/v1/visitas', validateAuth(), visitaRoutes);
routes.use('/api/v1/inventario', validateAuth(), inventarioRoutes);
routes.use('/api/v1/reportes', validateAuth(), reportesRoutes);

routes.use('*', (_, res) => res.status(400).json({ message: 'You have an invalid endpoint' }));

export default routes;
