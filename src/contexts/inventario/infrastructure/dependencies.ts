import { InventarioSequelizeRepository } from './repositories/inventario.sequelize';
import { InventarioController } from './controller/inventario.controller';

const repo = new InventarioSequelizeRepository();
export const inventarioController = new InventarioController(repo);
