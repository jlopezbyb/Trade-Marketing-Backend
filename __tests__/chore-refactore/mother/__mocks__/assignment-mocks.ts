
import { AssignmentRepository } from '../../src/assignment/core/repositories/assignment-repository';
import { Validations } from '../../src/assignment/application/user-cases/validations';
import { NotificationMailRepository } from '../../src/assignment/core/repositories/notification-mail-repository';
import { EmployeeRepository } from '../../src/assignment/core/repositories/employee-repository';

import { mockLocationRepository } from "./location-mocks";
import { mockSettingRepository } from "./setting-mocks";

import { NotificationService } from '../../src/assignment/application/services/notification-service';

export const mockAssignmentRepository: jest.Mocked<AssignmentRepository> = {
  createAssignment: jest.fn(),
  createAssignmentLoan: jest.fn(),
  createDiscountNote: jest.fn(),
  createDeAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  updateStatusDiscountNote: jest.fn(),
  deleteAssignmentLoan: jest.fn(),
  updateAssignmentLoan: jest.fn(),
  getAssignmentById: jest.fn(),
  getAssignmentLoanById: jest.fn(),
  getDiscountNoteById: jest.fn(),
  getAssignments: jest.fn(),
  changeStatusAssignment: jest.fn(),
  executeFunction: jest.fn(),
  getLastAssignmentInactiveBySlotId: jest.fn(),
  getAssignmentLoanByIdAssignment: jest.fn(),
};



export const mockNotificationRepository: jest.Mocked<NotificationMailRepository> = {
  assignmentGuestNotification: jest.fn(),
  assignmentNotification: jest.fn(),
  deAssignmentGuestNotification: jest.fn(),
  deAssignmentOwnerNotification: jest.fn(),
  discountNoteNotification: jest.fn()
};

export const mockEmployeeRepository: jest.Mocked<EmployeeRepository> = {
  getEmployeeByIdFromDatabase: jest.fn(),
  getEmployeeFromDatabase: jest.fn(),
  getEmployeeFromWebService: jest.fn(),
};

export const mockNotificationService = new NotificationService(
  mockNotificationRepository
);

export const mockValidations = new Validations(mockAssignmentRepository, mockEmployeeRepository, mockSettingRepository, mockLocationRepository);
