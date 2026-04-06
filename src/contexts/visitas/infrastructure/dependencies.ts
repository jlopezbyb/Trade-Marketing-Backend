import { VisitaSequelizeRepository } from './repositories/visita.sequelize';
import { VisitaController } from './controller/visita.controller';

const repo = new VisitaSequelizeRepository();
export const visitaController = new VisitaController(repo);
