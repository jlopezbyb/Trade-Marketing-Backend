/* eslint-disable  @typescript-eslint/no-base-to-string */

import { Request, Response } from 'express';
import { NextFunction } from 'express';

import { CreateLocation } from '@src/contexts/location/application/use-cases/create-location';
import { UpdateLocation } from '@src/contexts/location/application/use-cases/update-location';
import { DeleteLocation } from '@src/contexts/location/application/use-cases/delete-location';
import { GetLocationByIdFinder } from '@src/contexts/location/application/use-cases/location-by-id-finder';
import { LocationFinder } from '@src/contexts/location/application/use-cases/location-finder';
import { StatisticsDataUseCase } from '../../application/use-cases/statistics-data';
import { TrendDataType } from '@src/contexts/location/core/repositories/location-repository';

import { SlotsAvailableFinderUseCase } from '@src/contexts/location/application/use-cases/finder/slots-available';
import { VehicleType } from '../../core/entities/slot-entity';

import { AuthenticatedRequest } from '@src/server/middleware/authenticated-request';

export class LocationController {
  constructor(
    private readonly createLocationUseCase: CreateLocation,
    private readonly updateLocationUseCase: UpdateLocation,
    private readonly deleteLocationUseCase: DeleteLocation,
    private readonly getLocationByIdFinderUseCase: GetLocationByIdFinder,
    private readonly locationFinderUseCase: LocationFinder,
    private readonly statisticsDataUseCase: StatisticsDataUseCase,
    private readonly slotsAvailableFinderUseCase: SlotsAvailableFinderUseCase
  ) {}

  async createLocation(req: Request, res: Response, next: NextFunction) {
    const authReq = req as AuthenticatedRequest;
    const locationData = req.body;

    try {
      await this.createLocationUseCase.run({
        ...locationData,
        username: authReq.user?.username ?? 'unknown' // 👈 Agregamos username
      });

      res.status(201).send({ message: 'Location created' });
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    const locationData = req.body;
    const locationId = req.params.id;
    const slotsToDelete = req.body.slotsToDelete;

    locationData.id = locationId;

    try {
      await this.updateLocationUseCase.run(locationData, new Set(slotsToDelete));
      res.status(200).send({ message: 'Location updated' });
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req: Request, res: Response, next: NextFunction) {
    const locationId = req.params.id;
    try {
      await this.deleteLocationUseCase.run(locationId);
      res.status(200).send({ message: 'Location deleted' });
    } catch (error) {
      next(error);
    }
  }

  async locationFinderById(req: Request, res: Response, next: NextFunction) {
    try {
      const locationId = req.params.id;
      const location = await this.getLocationByIdFinderUseCase.run(locationId);

      const response = { data: location };
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  async locationFinder(req: Request, res: Response, next: NextFunction) {
    const { limit, page } = req.query;

    try {
      const data = await this.locationFinderUseCase.run(Number(limit), Number(page));

      const response = { data: data?.data, pageCounter: data?.pageCounter };
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  async overviewParkingData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.statisticsDataUseCase.overviewData();
      res.status(200).send({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async trendParkingData(req: Request, res: Response, next: NextFunction) {
    const { type } = req.query;

    try {
      const data = await this.statisticsDataUseCase.trendData(type as TrendDataType);

      res.status(200).send({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getSlotsAvailable(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { vehicleType } = req.query;
    try {
      const data = await this.slotsAvailableFinderUseCase.run(id, vehicleType as VehicleType);
      res.status(200).send({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getEmployeesParkingStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.statisticsDataUseCase.getEmployeesParkingData();
      res.status(200).send({ data });
    } catch (error) {
      console.error('Error obteniendo estadísticas de empleados y parqueos:', error);
      next(error);
    }
  }

  async getParkingAvailabilityStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.statisticsDataUseCase.getParkingAvailabilityData();
      res.status(200).send({ data });
    } catch (error) {
      console.error('Error obteniendo estadísticas de disponibilidad de parqueos:', error);
      next(error);
    }
  }
}
