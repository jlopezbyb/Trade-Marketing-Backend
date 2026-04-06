import { NextFunction, Request, Response } from 'express';
import { SequelizeMYSQLReportsRepository } from '../repositories/sequelize-mysql-repository';

const reportsRepository = new SequelizeMYSQLReportsRepository();

export class ReportsController {
  async getLocationsReport(req: Request, res: Response, next: NextFunction) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 10));
    try {
      // Get the total count of reports
      const totalReports = await reportsRepository.countReportByLocation();

      // Calculate total number of pages and round up
      const pageCounter = Math.ceil(totalReports / limit);

      // Fetch the reports for the current page
      const report = await reportsRepository.fetchReportByLocation(limit, page);

      // Send the response with pagination info
      res.status(200).send({ data: report, meta: { page, limit, pageCounter, totalCount: totalReports } });
    } catch (error) {
      next(error);
    }
  }

  async getDetailsReportByCollaborator(req: Request, res: Response, next: NextFunction) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 10));
    try {
      // Get the total count of reports
      const totalReports = await reportsRepository.countReportByCollaborator();

      // Calculate total number of pages and round up
      const pageCounter = Math.ceil(totalReports / limit);

      // Fetch the reports for the current page
      const report = await reportsRepository.fetchReportByCollaborator({ limit, page });

      res.status(200).send({ data: report, meta: { page, limit, pageCounter, totalCount: totalReports } });
    } catch (error) {
      next(error);
    }
  }

  async getDetailReportByCollaboratorWithCost(req: Request, res: Response, next: NextFunction) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 10));
    try {
      // Get the total count of reports
      const totalReports = await reportsRepository.countReportByCollaboratorWithCost();

      // Calculate total number of pages and round up
      const pageCounter = Math.ceil(totalReports / limit);

      // Fetch the reports for the current page
      const report = await reportsRepository.fetchReportByCollaboratorWithCost(page, limit);

      res.status(200).send({ data: report, meta: { page, limit, pageCounter, totalCount: totalReports } });
    } catch (error) {
      next(error);
    }
  }

  async getAssignedParkingByPeriod(req: Request, res: Response, next: NextFunction) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 10));

    // Extract startDate and endDate from the query parameters
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    try {
      const report = await reportsRepository.fetchReportByAssignedParking(page, limit, startDate, endDate);
      // Get the total count of reports
      const totalReports = await reportsRepository.countReportByAssignedParking(startDate, endDate);

      // Calculate total number of pages and round up
      const pageCounter = Math.ceil(totalReports / limit);
      res.status(200).send({ data: report, meta: { page, limit, pageCounter, totalCount: totalReports } });
    } catch (error) {
      next(error);
    }
  }
}
