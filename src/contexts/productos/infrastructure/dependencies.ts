import { ProductoSequelizeRepository } from './repositories/producto.sequelize';
import { ProductoController } from './controller/producto.controller';

const repo = new ProductoSequelizeRepository();
export const productoController = new ProductoController(repo);
