import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';

export interface LocationReport {
  parkingName: string;
  numberOfIdentifier: string;
  noCost: number;
  reimbursement: number;
  discount: number;
  vehicleCount: number;
  motorcycleCount: number;
  truckCount: number;
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  occupancyRate: number;
}

export interface ReportsRepository {
  fetchReportByLocation(limit: number, page: number): Promise<LocationReport[]>;
  countReportByLocation(): Promise<number>;
  fetchReportByCollaborator({ page, limit }: { limit: number; page: number }): Promise<EmployeeModel[]>;
  countReportByCollaborator(): Promise<number>;
  fetchReportByCollaboratorWithCost(limit: number, page: number): Promise<EmployeeModel[]>;
  countReportByCollaboratorWithCost(): Promise<number>;
  fetchReportByAssignedParking(page: number, limit: number, startDate: string, endDate: string): Promise<EmployeeModel[]>;
  countReportByAssignedParking(startDate: string, endDate: string): Promise<number>;
}
