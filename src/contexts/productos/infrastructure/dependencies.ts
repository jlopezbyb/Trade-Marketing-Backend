import { ProductoSequelizeRepository } from './repositories/producto.sequelize';
import { GetAllProductosUseCase } from '../application/use-cases/get-all-productos';
import { ProductoController } from './controller/producto.controller';

const repo = new ProductoSequelizeRepository();
const getAllUseCase = new GetAllProductosUseCase(repo);
export const productoController = new ProductoController(getAllUseCase);
