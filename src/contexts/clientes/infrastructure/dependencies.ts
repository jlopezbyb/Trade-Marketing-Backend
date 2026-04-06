import { ClienteSequelizeRepository } from './repositories/cliente.sequelize';
import { ClienteController } from './controller/cliente.controller';

const repo = new ClienteSequelizeRepository();
export const clienteController = new ClienteController(repo);
