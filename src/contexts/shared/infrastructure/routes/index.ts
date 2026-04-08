import { Router } from 'express';
import authRoutes from '@src/contexts/auth/infrastructure/routes/auth.routes';
import clienteRoutes from '@src/contexts/clientes/infrastructure/routes/cliente.routes';
import categoriaRoutes from '@src/contexts/categorias/infrastructure/routes/categoria.routes';
import productoRoutes from '@src/contexts/productos/infrastructure/routes/producto.routes';
import usersRoutes from '@src/contexts/users/infrastructure/routes/users.routes';
import visitaRoutes from '@src/contexts/visitas/infrastructure/routes/visita.routes';
import inventarioRoutes from '@src/contexts/inventario/infrastructure/routes/inventario.routes';
import reportesRoutes from '@src/contexts/reportes/infrastructure/routes/reportes.routes';
import { validateAuthFlexible } from '@src/server/middleware/validate-auth-flexible';

// Import trade model relations
import '@src/contexts/shared/infrastructure/models/trade/trade-relations';

const routes = Router();

routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

// Auth
routes.use('/api/v1/auth', authRoutes);

// Trade Marketing API protegida con JWT (token o token_employee)
routes.use('/api/v1/clientes', validateAuthFlexible(), clienteRoutes);
routes.use('/api/v1/categorias', validateAuthFlexible(), categoriaRoutes);
routes.use('/api/v1/productos', validateAuthFlexible(), productoRoutes);
routes.use('/api/v1/users', validateAuthFlexible(), usersRoutes);
routes.use('/api/v1/visitas', validateAuthFlexible(), visitaRoutes);
routes.use('/api/v1/inventario', validateAuthFlexible(), inventarioRoutes);
routes.use('/api/v1/reportes', validateAuthFlexible(), reportesRoutes);

routes.use('*', (_, res) => res.status(400).json({ message: 'You have an invalid endpoint' }));

export default routes;
