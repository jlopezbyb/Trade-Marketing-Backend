import { InventarioSequelizeRepository } from './repositories/inventario.sequelize';
import { GetAllInventarioUseCase } from '../application/use-cases/get-all-inventario';
import { CreateInventarioUseCase } from '../application/use-cases/create-inventario';
import { InventarioController } from './controller/inventario.controller';

const repo = new InventarioSequelizeRepository();
const getAllUseCase = new GetAllInventarioUseCase(repo);
const createUseCase = new CreateInventarioUseCase(repo);
export const inventarioController = new InventarioController(getAllUseCase, createUseCase);
