import { z } from 'zod';

export const locationCreateSchema = z.object({
  name: z.string().max(75),
  address: z.string().max(75),
  contactReference: z.string().max(60).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().max(50).email(),
  comments: z.string().max(255).optional(),
  numberOfIdentifier: z.string().max(25).optional(),
  status: z.string().max(50),
  slots: z.array(
    z.object({
      slotNumber: z.string().max(25),
      slotType: z.string().max(50),
      limitOfAssignments: z.number().min(1).max(255),
      vehicleType: z.string().max(50),
      benefitType: z.string().max(50),
      amount: z.number().min(0).max(9999.99),
      status: z.string().max(50)
    })
  )
});

export const locationUpdateParamsSchema = z.object({
  id: z.string().uuid()
});

export const locationUpdateSchema = z.object({
  name: z.string().max(75),
  address: z.string().max(75),
  contactReference: z.string().max(60).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().max(50).email(),
  comments: z.string().max(255).optional(),
  numberOfIdentifier: z.string().max(25).optional(),
  status: z.string(),
  slots: z.array(
    z.object({
      id: z.string().uuid().optional(),
      slotNumber: z.string().max(25),
      slotType: z.string().max(50),
      limitOfAssignments: z.number().min(1).max(255),
      vehicleType: z.string().max(50),
      benefitType: z.string().max(50),
      amount: z.number().min(0).max(9999.99),
      status: z.string().max(50)
    })
  ),
  slotsToDelete: z.array(z.string().uuid())
});

export const locationDeleteParamsSchema = z.object({
  id: z.string().uuid()
});

export const getLocationByIdSchema = z.object({
  id: z.string().uuid()
});

export const getLocationsSchemaForQuery = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1)
});

export const deleteSlotsSchema = z.object({
  slots: z.array(z.string().uuid())
});

export const trendSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly'])
});

export const getAvailableSlotsSchema = z.object({
  vehicleType: z.string().max(50)
});
