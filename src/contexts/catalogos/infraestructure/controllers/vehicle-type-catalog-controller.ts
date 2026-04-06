import { Request, Response, NextFunction } from 'express';
import { CreateVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/create-vehicle-type';
import { GetByIdVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/get-by-id-vehicle-type';
import { GetAllVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/get-all-vehicle-type';
import { UpdateVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/update-vehicle-type';
import { DeleteVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/delete-vehicle-type';

export class VehicleTypeCatalogController {
  constructor(
    private readonly createVehicleTypeUseCase: CreateVehicleTypeUseCase,
    private readonly getByIdVehicleTypeUseCase: GetByIdVehicleTypeUseCase,
    private readonly getAllVehicleTypeUseCase: GetAllVehicleTypeUseCase,
    private readonly updateVehicleTypeUseCase: UpdateVehicleTypeUseCase,
    private readonly deleteVehicleTypeUseCase: DeleteVehicleTypeUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, description, isActive } = req.body;
    try {
      await this.createVehicleTypeUseCase.run({ name, description, isActive });
      res.status(201).json({ message: 'Vehicle type created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleTypes = await this.getAllVehicleTypeUseCase.run();
      res.status(200).json({ data: vehicleTypes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const vehicleType = await this.getByIdVehicleTypeUseCase.run(id);
      res.status(200).json(vehicleType);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    try {
      await this.updateVehicleTypeUseCase.run(id, { name, description, isActive });
      res.status(200).json({ message: 'Vehicle type updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.deleteVehicleTypeUseCase.run(id);
      res.status(200).json({ message: 'Vehicle type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
