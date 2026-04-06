import { v4 as uuidv4 } from 'uuid';
import { AuditModel } from '../models/audit.model';

export class AuditService {
  public static async log(
    username: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    useCase: string,
    targetId?: string,
    targetType?: string
  ) {
    await AuditModel.create({
      id: uuidv4(),
      username,
      action,
      use_case: useCase,
      target_id: targetId,
      target_type: targetType
    });
  }
}
