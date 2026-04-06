import { z } from 'zod';

export const vehicleSchema = z.array(
  z.object({
    id: z.string().uuid().optional(),
    vehicleBadge: z.string().min(1).max(10),
    color: z.string().min(1).max(20),
    brand: z.string().min(1).max(20),
    model: z.string().min(1).max(50),
    type: z.string().min(1).max(50)
  })
);

export const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  employeeCode: z.string().min(1).max(12),
  name: z.string().min(1).max(75),
  workplace: z.string().max(100),
  identifierDocument: z.string().min(1).max(20),
  company: z.string().max(100),
  department: z.string().max(100),
  subManagement: z.string().max(100),
  management1: z.string().max(100),
  management2: z.string().max(100),
  workSite: z.string().max(100),
  address: z.string().max(100),
  email: z.string().email().max(100),
  phone: z.string(),
  vehicles: vehicleSchema,
  dpi: z.number().int().min(9).max(10)
});

export const assignmentCreateSchema = z.object({
  slotId: z.string().uuid(),
  employee: employeeSchema.extend({
    vehiclesForDelete: z.array(z.string().uuid())
  }),
  parkingCardNumber: z.string().optional(),
  tags: z.array(z.string().uuid()).nonempty()
});

export const assignmentUpdateSchema = z.object({
  employee: employeeSchema.pick({ vehicles: true }),
  vehiclesForDelete: z.array(z.string().uuid()),
  tags: z.array(z.string().uuid()).nonempty()
});

const assignmentId = z.object({
  assignment_id: z.string().uuid().optional()
});

const assignmentLoanId = z.object({
  assignment_loan_id: z.string().uuid().optional()
});

const discountNoteId = z.object({
  discount_note_id: z.string().uuid().optional()
});

export const employeeCode = z.object({
  employee_code: z.string().optional()
});

export const assignmentIdSchema = z.union([assignmentId, assignmentLoanId, discountNoteId, employeeCode]);

export const createDeAssignmentBodySchema = z.object({
  reason: z.string(),
  deAssignmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
});

export const getAssignmentsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

export const getEmployeeByCodeSchemaForParams = z.object({
  code: z.string()
});

export const statusDiscountNoteBodySchema = z.object({
  status: z.enum(['APROBADO', 'RECHAZADO', 'CANCELADO'])
});
