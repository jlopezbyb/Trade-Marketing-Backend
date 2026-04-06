import { z } from 'zod';

import { employeeSchema } from './assignment-zod-schemas';
import { vehicleSchema } from './assignment-zod-schemas';

export const assignmentLoanSchema = z.object({
  startDateAssignment: z.string().date('YYYY-MM-DD'),
  endDateAssignment: z.string().date('YYYY-MM-DD'),
  employee: employeeSchema
});

export const schemaForAssignmentLoanUpdate = z.object({
  startDateAssignment: z.string().date('YYYY-MM-DD'),
  endDateAssignment: z.string().date('YYYY-MM-DD'),
  employee: z.object({ vehicles: vehicleSchema }),
  vehiclesForDelete: z.array(z.string().uuid())
});
