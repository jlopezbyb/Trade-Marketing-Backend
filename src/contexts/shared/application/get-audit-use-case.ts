import { AuditModel } from '../infrastructure/models/audit.model';

export class GetAuditLogs {
  public async run(): Promise<any[]> {
    const logs = await AuditModel.findAll({
      order: [['timestamp', 'DESC']]
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return logs.map(log => log.toJSON());
  }
}
