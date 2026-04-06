import { CategoriaSequelizeRepository } from './repositories/categoria.sequelize';
import { CategoriaController } from './controller/categoria.controller';

const repo = new CategoriaSequelizeRepository();
export const categoriaController = new CategoriaController(repo);
