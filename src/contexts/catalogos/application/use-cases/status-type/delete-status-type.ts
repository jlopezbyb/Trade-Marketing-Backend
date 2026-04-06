import { StatusTypeCatalogRepository } from '@src/contexts/catalogos/core/repositories/status-type-catalog-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';
import { ForeignKeyConstraintError } from 'sequelize';

export class DeleteStatusTypeUseCase {
  constructor(private readonly statusTypeCatalogRepository: StatusTypeCatalogRepository) {}

  async run(id: string) {
    const statusType = await this.statusTypeCatalogRepository.getById(id);

    if (!statusType) {
      throw new AppError('VEHICLE_TYPE_NOT_FOUND', 404, 'Vehicle type not found', true);
    }

    try {
      await this.statusTypeCatalogRepository.delete(id);
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new AppError('FOREIGN_KEY_CONSTRAINT', 400, 'Cannot delete vehicle type: It is referenced by another record', true);
      }
      throw new AppError('INTERNAL_SERVER_ERROR', 500, 'An unexpected error occurred', true);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isForeignKeyError(error: any): boolean {
    return error instanceof ForeignKeyConstraintError || error.original?.errno === 1451;
  }
}
