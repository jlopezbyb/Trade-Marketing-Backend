import { SequelizeMysqlVehicleTypeCatalogRepository } from './sequelize-mysql-vehicle-type-catalog-repository';
import { SequelizeMysqlSlotTypeCatalogRepository } from './sequelize-mysql-slot-type-catalog-repository';
import { SequelizeMysqlBenefitTypeCatalogRepository } from './sequelize-mysql-benefit-type-catalog-repository';

import { VehicleTypeCatalogController } from '../controllers/vehicle-type-catalog-controller';
import { SlotTypeCatalogController } from '../controllers/slot-type-catalog-controller';
import { BenefitTypeCatalogController } from '../controllers/benefit-type-catalog-controller';
import { CreateBenefitTypeUseCase } from '../../application/use-cases/benefit-type/create-benefit-type';
import { CreateVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/create-vehicle-type';
import { GetByIdVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/get-by-id-vehicle-type';
import { GetAllVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/get-all-vehicle-type';
import { UpdateVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/update-vehicle-type';
import { DeleteVehicleTypeUseCase } from '../../application/use-cases/vehicle-type/delete-vehicle-type';
import { CreateSlotTypeUseCase } from '../../application/use-cases/slot-types/create-slot-type';
import { GetByIdSlotTypeUseCase } from '../../application/use-cases/slot-types/get-by-id-slot-type';
import { GetAllSlotTypeUseCase } from '../../application/use-cases/slot-types/get-all-slot-type';
import { UpdateSlotTypeUseCase } from '../../application/use-cases/slot-types/update-slot-type';
import { DeleteSlotTypeUseCase } from '../../application/use-cases/slot-types/delete-slot-type';
import { GetByIdBenefitTypeUseCase } from '../../application/use-cases/benefit-type/get-by-id-benefit-type';
import { GetAllBenefitTypeUseCase } from '../../application/use-cases/benefit-type/get-all-benefit-type';
import { UpdateBenefitTypeUseCase } from '../../application/use-cases/benefit-type/update-benefit-type';
import { DeleteBenefitTypeUseCase } from '../../application/use-cases/benefit-type/delete-benefit-type';
import { SequelizeMysqlStatusTypeCatalogRepository } from './sequelize-mysql-status-type-catalog-repository';
import { CreateStatusTypeUseCase } from '../../application/use-cases/status-type/create-status-type';
import { StatusTypeCatalogController } from '../controllers/status-type-catalog-controller';
import { GetByIdStatusTypeUseCase } from '../../application/use-cases/status-type/get-by-id-status-type';
import { GetAllStatusTypeUseCase } from '../../application/use-cases/status-type/get-all-status-type';
import { UpdateStatusTypeUseCase } from '../../application/use-cases/status-type/update-status-type';
import { DeleteStatusTypeUseCase } from '../../application/use-cases/status-type/delete-status-type';
import { SequelizeMysqlStatusSlotTypeCatalogRepository } from './sequelize-mysql-status-slot-type';
import { CreateStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/create-status-slot-type';
import { GetByIdStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/get-by-id-status-slot-type';
import { GetAllStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/get-all-status-slot-type';
import { UpdateStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/update-status-slot-type';
import { DeleteStatusSlotTypeUseCase } from '../../application/use-cases/status-slot-type/delete-status-slot-type';
import { StatusSlotTypeCatalogController } from '../controllers/status-slot-catalog-controller';

//Catalogs
const vehicleTypeCatalogRepository = new SequelizeMysqlVehicleTypeCatalogRepository();

const createVehicleTypeUseCase = new CreateVehicleTypeUseCase(vehicleTypeCatalogRepository);
const getByIdVehicleTypeUseCase = new GetByIdVehicleTypeUseCase(vehicleTypeCatalogRepository);
const getAllVehicleTypeUseCase = new GetAllVehicleTypeUseCase(vehicleTypeCatalogRepository);
const updateVehicleTypeUseCase = new UpdateVehicleTypeUseCase(vehicleTypeCatalogRepository);
const deleteVehicleTypeUseCase = new DeleteVehicleTypeUseCase(vehicleTypeCatalogRepository);

const vehicleTypeCatalogController = new VehicleTypeCatalogController(
  createVehicleTypeUseCase,
  getByIdVehicleTypeUseCase,
  getAllVehicleTypeUseCase,
  updateVehicleTypeUseCase,
  deleteVehicleTypeUseCase
);

//Catalogs Status
const statusTypeCatalogRepository = new SequelizeMysqlStatusTypeCatalogRepository();

const createStatusTypeUseCase = new CreateStatusTypeUseCase(statusTypeCatalogRepository);
const getByIdStatusTypeUseCase = new GetByIdStatusTypeUseCase(statusTypeCatalogRepository);
const getAllStatusTypeUseCase = new GetAllStatusTypeUseCase(statusTypeCatalogRepository);
const updateStatusTypeUseCase = new UpdateStatusTypeUseCase(statusTypeCatalogRepository);
const deleteStatusTypeUseCase = new DeleteStatusTypeUseCase(statusTypeCatalogRepository);

const statusTypeCatalogController = new StatusTypeCatalogController(
  createStatusTypeUseCase,
  getByIdStatusTypeUseCase,
  getAllStatusTypeUseCase,
  updateStatusTypeUseCase,
  deleteStatusTypeUseCase
);

//Catalogs Slot Status
const statusSlotTypeCatalogRepository = new SequelizeMysqlStatusSlotTypeCatalogRepository();

const createStatusSlotTypeUseCase = new CreateStatusSlotTypeUseCase(statusSlotTypeCatalogRepository);
const getByIdStatusSlotTypeUseCase = new GetByIdStatusSlotTypeUseCase(statusSlotTypeCatalogRepository);
const getAllStatusSlotTypeUseCase = new GetAllStatusSlotTypeUseCase(statusSlotTypeCatalogRepository);
const updateStatusSlotTypeUseCase = new UpdateStatusSlotTypeUseCase(statusSlotTypeCatalogRepository);
const deleteStatusSlotTypeUseCase = new DeleteStatusSlotTypeUseCase(statusSlotTypeCatalogRepository);

const statusSlotTypeCatalogController = new StatusSlotTypeCatalogController(
  createStatusSlotTypeUseCase,
  getByIdStatusSlotTypeUseCase,
  getAllStatusSlotTypeUseCase,
  updateStatusSlotTypeUseCase,
  deleteStatusSlotTypeUseCase
);

const SlotTypeCatalogRepository = new SequelizeMysqlSlotTypeCatalogRepository();

const createSlotTypeUseCase = new CreateSlotTypeUseCase(SlotTypeCatalogRepository);
const getByIdSlotTypeUseCase = new GetByIdSlotTypeUseCase(SlotTypeCatalogRepository);
const getAllSlotTypeUseCase = new GetAllSlotTypeUseCase(SlotTypeCatalogRepository);
const updateSlotTypeUseCase = new UpdateSlotTypeUseCase(SlotTypeCatalogRepository);
const deleteSlotTypeUseCase = new DeleteSlotTypeUseCase(SlotTypeCatalogRepository);

const slotTypeCatalogController = new SlotTypeCatalogController(
  createSlotTypeUseCase,
  getByIdSlotTypeUseCase,
  getAllSlotTypeUseCase,
  updateSlotTypeUseCase,
  deleteSlotTypeUseCase
);

const benefitTypeCatalogRepository = new SequelizeMysqlBenefitTypeCatalogRepository();

const createBenefitTypeUseCase = new CreateBenefitTypeUseCase(benefitTypeCatalogRepository);
const getByIdBenefitTypeUseCase = new GetByIdBenefitTypeUseCase(benefitTypeCatalogRepository);
const getAllBenefitTypeUseCase = new GetAllBenefitTypeUseCase(benefitTypeCatalogRepository);
const updateBenefitTypeUseCase = new UpdateBenefitTypeUseCase(benefitTypeCatalogRepository);
const deleteBenefitTypeUseCase = new DeleteBenefitTypeUseCase(benefitTypeCatalogRepository);

const benefitTypeCatalogController = new BenefitTypeCatalogController(
  createBenefitTypeUseCase,
  getByIdBenefitTypeUseCase,
  getAllBenefitTypeUseCase,
  updateBenefitTypeUseCase,
  deleteBenefitTypeUseCase
);

export {
  vehicleTypeCatalogController,
  slotTypeCatalogController,
  benefitTypeCatalogController,
  statusTypeCatalogController,
  statusSlotTypeCatalogController
};
