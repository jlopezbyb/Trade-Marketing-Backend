import { SequelizeMYSQLLocationRepository } from './sequelize-mysql-repository';
import { LocationController } from '../controllers/location.controller';

import { CreateLocation } from '@src/contexts/location/application/use-cases/create-location';
import { UpdateLocation } from '@src/contexts/location/application/use-cases/update-location';
import { DeleteLocation } from '@src/contexts/location/application/use-cases/delete-location';
import { GetLocationByIdFinder } from '@src/contexts/location/application/use-cases/location-by-id-finder';
import { LocationFinder } from '@src/contexts/location/application/use-cases/location-finder';
import { StatisticsDataUseCase } from '@src/contexts/location/application/use-cases/statistics-data';

import { SlotsAvailableFinderUseCase } from '@src/contexts/location/application/use-cases/finder/slots-available';
import { ValidationsUseCases } from '@src/contexts/location/application/use-cases/validations';

const locationRepository = new SequelizeMYSQLLocationRepository();

const validationsUseCases = new ValidationsUseCases(locationRepository);

//Use cases
const createLocation = new CreateLocation(locationRepository);
const updateLocation = new UpdateLocation(locationRepository, validationsUseCases);
const deleteLocation = new DeleteLocation(locationRepository);
const locationFinder = new LocationFinder(locationRepository);
const locationFinderById = new GetLocationByIdFinder(locationRepository);
const statisticsDataUseCase = new StatisticsDataUseCase(locationRepository);
const slotsAvailableFinderUseCase = new SlotsAvailableFinderUseCase(locationRepository);

//Controllers
const locationController = new LocationController(
  createLocation,
  updateLocation,
  deleteLocation,
  locationFinderById,
  locationFinder,
  statisticsDataUseCase,
  slotsAvailableFinderUseCase
);

export { locationController };
