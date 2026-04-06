import { Router } from 'express';
import locationRoutes from '@src/contexts/location/infrastructure/routes/location-routes';
import assignmentRoutes from '@src/contexts/assignment/infrastructure/routes/assignment-routes';
import tagRoutes from '@src/contexts/parameters/infrastructure/routes/tag.routes';
import userRoutes from '@src/contexts/auth/infrastructure/routes/user.routes';
import roleRoutes from '@src/contexts/auth/infrastructure/routes/role.routes';
import authRoutes from '@src/contexts/auth/infrastructure/routes/auth.routes';
import settingRoutes from '@src/contexts/parameters/infrastructure/routes/setting.routes';
import templateRoutes from '@src/contexts/parameters/infrastructure/routes/template.routes';
import preferenceRoutes from '@src/contexts/parameters/infrastructure/routes/setting-preferences.routes';
import notificationsRoutes from '@src/contexts/notifications/infrastructure/routes/notifications.routes';
import benefitTypeCatalogRoutes from '@src/contexts/catalogos/infraestructure/routes/benefit-type-catalog.routes';
import vehicleTypeCatalogRoutes from '@src/contexts/catalogos/infraestructure/routes/vehicle-type-catalog.routes';
import slotTypeCatalogRoutes from '@src/contexts/catalogos/infraestructure/routes/slot-type-catalog.routes';
import statusTypeCatalogRoutes from '@src/contexts/catalogos/infraestructure/routes/status-type-catalog.routes';
import statusSlotTypeCatalogRoutes from '@src/contexts/catalogos/infraestructure/routes/status-slot-type-catalog-controller';
import reportsRoutes from '@src/contexts/reports/infrastructure/routes/reports-routes';
import authEmployeeRoutes from '@src/contexts/auth copy/infrastructure/routes/auth-employee.routes';
import { validateAuth } from '@server/middleware/auth-middleware';
import auditRoutes from '@src/contexts/shared/infrastructure/routes/audit.routes';
import { attachCSRFToken } from '@src/server/middleware/csrf-protection';
import { validateCSRF } from '@src/server/middleware/csrf-protection';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';
import { validateAuthFlexible } from '@src/server/middleware/validate-auth-flexible';
//import { validateAuthFlexible } from '@src/server/middleware/validate-auth-flexible';

const routes = Router();

routes.get('/api/v1/health', (req, res) => {
  res.json({ message: 'ok' });
});

routes.get('/api/v1/csrf/health', attachCSRFToken, (req, res) => {
  res.json({ message: 'ok' });
});

//Rutas auth para usuarios administradores
routes.use('/api/v1/auth', authRoutes);
//Rutas auth para empleados
routes.use('/api/v1/auth/', authEmployeeRoutes);

//Resto de rutas
routes.use('/api/v1/parking/', validateAuth(), locationRoutes);
routes.use('/api/v1/assignment', assignmentRoutes);
routes.use(
  '/api/v1/parameter/tag',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters', 'assign-parking']),
  tagRoutes
);
routes.use('/api/v1/parameter/settings', validateCSRF, validateAuth(), settingRoutes);
routes.use('/api/v1/parameter/users', validateCSRF, validateAuth(), checkAccessByRole(['users']), userRoutes);
routes.use('/api/v1/parameter/roles', validateCSRF, validateAuth(), checkAccessByRole(['users']), roleRoutes);
routes.use(
  '/api/v1/parameter/template',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters']),
  templateRoutes
);
routes.use(
  '/api/v1/parameter/notifications/preferences',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-notifications']),
  preferenceRoutes
);
routes.use(
  '/api/v1/notification',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-notifications']),
  notificationsRoutes
);
routes.use(
  '/api/v1/parameters/catalogs/benefit-types',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters', 'parking-crud']),
  benefitTypeCatalogRoutes
);
routes.use(
  '/api/v1/parameters/catalogs/vehicle-types',
  validateCSRF,
  validateAuthFlexible(),
  checkAccessByRole(['employee', 'management-parameters', 'parking-crud', 'users']),
  vehicleTypeCatalogRoutes
);

routes.use(
  '/api/v1/parameters/catalogs/slot-types',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters', 'parking-crud', 'users']),
  slotTypeCatalogRoutes
);
routes.use(
  '/api/v1/parameters/catalogs/status-types',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters', 'parking-crud', 'users']),
  statusTypeCatalogRoutes
);
routes.use(
  '/api/v1/parameters/catalogs/status-slot-types',
  validateCSRF,
  validateAuth(),
  checkAccessByRole(['management-parameters', 'parking-crud', 'users']),
  statusSlotTypeCatalogRoutes
);
routes.use('/api/v1/reports', validateCSRF, validateAuth(), reportsRoutes);
routes.use('/api/v1/audit-logs', validateCSRF, validateAuth(), checkAccessByRole(['dashboard']), auditRoutes);

routes.use('/api/v1/audit-logs', validateCSRF, validateAuth(), auditRoutes);

routes.use('*', (_, res) => res.status(400).json({ message: 'You have an invalid endpoint' }));

export default routes;
