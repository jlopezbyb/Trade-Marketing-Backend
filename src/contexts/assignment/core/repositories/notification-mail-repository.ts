export type EmailData = {
  to: string;
  subject: string;
  text: string;
};

export interface NotificationMailRepository {
  assignmentNotification(
    employee: { name: string; email: string; token: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startTime: string; endTime: string } | null
  ): Promise<void>;
  assignmentGuestNotification(
    owner: { name: string; email: string },
    guest: { name: string; email: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startDate: string; endDate: string }
  ): Promise<void>;
  discountNoteNotification(owner: { name: string; email: string }, rrhh: { name: string; email: string }): Promise<void>;
  deAssignmentOwnerNotification(owner: { name: string; email: string }): Promise<void>;
  deAssignmentGuestNotification(guest: { name: string; email: string }): Promise<void>;
}
