import { Request, Response, NextFunction } from 'express';
import { GetAuditLogs } from '../../application/get-audit-use-case';

export class AuditController {
  constructor(private readonly getAuditLogsUseCase: GetAuditLogs) {}

  public async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await this.getAuditLogsUseCase.run();
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }
}
