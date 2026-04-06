import { Router } from 'express';

import { locationCreateSchema } from '../utils/location-zod-schemas';
import { locationUpdateSchema } from '../utils/location-zod-schemas';
import { locationUpdateParamsSchema } from '../utils/location-zod-schemas';
import { locationDeleteParamsSchema } from '../utils/location-zod-schemas';
import { getLocationByIdSchema } from '../utils/location-zod-schemas';
import { getLocationsSchemaForQuery } from '../utils/location-zod-schemas';
import { trendSchema } from '../utils/location-zod-schemas';
import { getAvailableSlotsSchema } from '../utils/location-zod-schemas';
import rateLimit from 'express-rate-limit';

import { locationController } from '@src/contexts/location/infrastructure/repositories/dependecies';
import { validateRequest } from '@src/server/utils/zod-validator';
import { extractUserFromToken } from '@src/server/middleware/audit-middleware';
import { checkAccessByRole } from '@src/server/middleware/check-access-by-role';

const routes = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

routes
  .post(
    '/location',
    limiter,
    extractUserFromToken,
    checkAccessByRole(['parking-crud']),
    validateRequest(locationCreateSchema, 'body'),
    locationController.createLocation.bind(locationController)
  )
  .get(
    '/location',
    checkAccessByRole(['parking-crud', 'assign-parking']),
    validateRequest(getLocationsSchemaForQuery, 'query'),
    locationController.locationFinder.bind(locationController)
  )
  .get(
    '/location/available-slots/:id',
    checkAccessByRole(['parking-crud', 'assign-parking']),
    validateRequest(getLocationByIdSchema, 'params'),
    validateRequest(getAvailableSlotsSchema, 'query'),
    locationController.getSlotsAvailable.bind(locationController)
  )
  .get(
    '/location/:id',
    checkAccessByRole(['parking-crud']),
    validateRequest(getLocationByIdSchema, 'params'),
    locationController.locationFinderById.bind(locationController)
  )
  .put(
    '/location/:id',
    checkAccessByRole(['parking-crud']),
    validateRequest(locationUpdateParamsSchema, 'params'),
    validateRequest(locationUpdateSchema, 'body'),
    locationController.updateLocation.bind(locationController)
  )
  .delete(
    '/location/:id',
    checkAccessByRole(['parking-crud']),
    validateRequest(locationDeleteParamsSchema, 'params'),
    locationController.deleteLocation.bind(locationController)
  )
  .get(
    '/location/stats/overview',
    checkAccessByRole(['dashboard']),
    locationController.overviewParkingData.bind(locationController)
  )
  .get(
    '/location/stats/trend',
    checkAccessByRole(['dashboard']),
    validateRequest(trendSchema, 'query'),
    locationController.trendParkingData.bind(locationController)
  )
  .get(
    '/location/stats/employees-parking',
    checkAccessByRole(['dashboard']),
    locationController.getEmployeesParkingStats.bind(locationController)
  )
  .get(
    '/location/stats/parking-availability',
    checkAccessByRole(['dashboard']),
    locationController.getParkingAvailabilityStats.bind(locationController)
  );

export default routes;
