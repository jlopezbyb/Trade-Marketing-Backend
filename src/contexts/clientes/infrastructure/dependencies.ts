import { ClienteSequelizeRepository } from './repositories/cliente.sequelize';
import { GetAllClientesUseCase } from '../application/use-cases/get-all-clientes';
import { ClienteController } from './controller/cliente.controller';

const repo = new ClienteSequelizeRepository();
const getAllUseCase = new GetAllClientesUseCase(repo);
export const clienteController = new ClienteController(getAllUseCase);
