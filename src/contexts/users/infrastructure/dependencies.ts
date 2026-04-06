import { UsersSequelizeRepository } from './repositories/users.sequelize';
import { UsersController } from './controller/users.controller';

const repo = new UsersSequelizeRepository();
export const usersController = new UsersController(repo);
