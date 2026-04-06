import { VisitaSequelizeRepository } from './repositories/visita.sequelize';
import { GetAllVisitasUseCase } from '../application/use-cases/get-all-visitas';
import { CreateVisitaUseCase } from '../application/use-cases/create-visita';
import { VisitaController } from './controller/visita.controller';

const repo = new VisitaSequelizeRepository();
const getAllUseCase = new GetAllVisitasUseCase(repo);
const createUseCase = new CreateVisitaUseCase(repo);
export const visitaController = new VisitaController(getAllUseCase, createUseCase);
