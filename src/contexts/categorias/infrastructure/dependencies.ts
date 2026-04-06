import { CategoriaSequelizeRepository } from './repositories/categoria.sequelize';
import { GetAllCategoriasUseCase } from '../application/use-cases/get-all-categorias';
import { CategoriaController } from './controller/categoria.controller';

const repo = new CategoriaSequelizeRepository();
const getAllUseCase = new GetAllCategoriasUseCase(repo);
export const categoriaController = new CategoriaController(getAllUseCase);
