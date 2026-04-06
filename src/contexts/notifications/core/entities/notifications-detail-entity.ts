import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class NotificationDetailEntity {
  readonly id: string;
  readonly notificationId: string;
  readonly employeeId: string;

  constructor(id: string, notificationId: string, employeeId: string) {
    if (!id || !notificationId || !employeeId) {
      throw new AppError(
        'INVALID_NOTIFICATION_DETAIL_ENTITY',
        400,
        'NotificationDetail entity must have valid id, notificationId, and employeeId',
        true
      );
    }

    this.id = id;
    this.notificationId = notificationId;
    this.employeeId = employeeId;
  }

  static fromPrimitives(primitiveData: { id: string; notificationId: string; employeeId: string }) {
    if (!primitiveData.id || !primitiveData.notificationId || !primitiveData.employeeId) {
      throw new AppError(
        'INVALID_PRIMITIVE_DATA',
        400,
        'Primitive data must include valid id, notificationId, and employeeId',
        true
      );
    }

    return new NotificationDetailEntity(primitiveData.id, primitiveData.notificationId, primitiveData.employeeId);
  }

  toPrimitives() {
    return {
      id: this.id,
      notificationId: this.notificationId,
      employeeId: this.employeeId
    };
  }
}
