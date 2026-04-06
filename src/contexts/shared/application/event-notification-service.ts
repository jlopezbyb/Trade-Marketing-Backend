import { v4 as uuid } from 'uuid';

import { NotificationPreferenceRepository } from '@src/contexts/parameters/core/repositories/notification-preference-repository';
import { NotificationQueueRepository } from '../core/repositories.ts/notification-queue-repository';
import { EventStatus, EventType, NotificationQueue, Payload, SenderType, TargetType } from '../core/notification_queue';

export class EventNotificationService {
  constructor(
    private readonly notificationQueueRepository: NotificationQueueRepository,
    private readonly notificationPreferencesRepository: NotificationPreferenceRepository
  ) {}

  async publish(eventData: { eventType: EventType; transactionId: string; destinations: string[]; destinationsCC: string[] }) {
    const userDestinations = await this.notificationPreferencesRepository.getUsersByNotificationType(eventData.eventType);

    const notificationEntity = new NotificationQueue(
      uuid(),
      eventData.eventType,
      {
        transactionId: eventData.transactionId,
        destinations: [
          ...eventData.destinations.map(d => ({ sender: SenderType.EMAIL, address: d, target: TargetType.TO })),
          ...eventData.destinationsCC.map(d => ({ sender: SenderType.EMAIL, address: d, target: TargetType.CC })),
          ...userDestinations.map(user => ({
            sender: SenderType.EMAIL,
            address: user.email,
            target: TargetType.CC
          }))
        ]
      } satisfies Payload,
      EventStatus.PENDING
    );
    await this.notificationQueueRepository.create(notificationEntity);
  }
}
