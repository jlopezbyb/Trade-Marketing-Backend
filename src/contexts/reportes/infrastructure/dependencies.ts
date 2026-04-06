import { ReportesSequelizeRepository } from './repositories/reportes.sequelize';
import { ReportesController } from './controller/reportes.controller';

const repo = new ReportesSequelizeRepository();
export const reportesController = new ReportesController(repo);
