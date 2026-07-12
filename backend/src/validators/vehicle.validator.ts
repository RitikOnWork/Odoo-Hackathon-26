/**
 * validators/vehicle.validator.ts
 *
 * Zod schemas for all Vehicle-related API inputs.
 *
 * Schemas exported:
 *  - createVehicleSchema     → POST /vehicles
 *  - updateVehicleBodySchema → PUT /vehicles/:id
 *  - vehicleListQuerySchema  → GET /vehicles       (?status=&type=&region=&page=&limit=)
 *  - vehicleIdParamSchema    → route param :id validation
 */

import { z } from 'zod';
import { VehicleStatus } from '../constants/enums';

// ── Create Vehicle ────────────────────────────────────────────────────────────
export const createVehicleSchema = z.object({
  registrationNumber: z
    .string({ required_error: 'Registration number is required' })
    .trim()
    .min(2,  { message: 'Registration number must be at least 2 characters' })
    .max(20, { message: 'Registration number must not exceed 20 characters' }),

  name: z
    .string({ required_error: 'Vehicle name/model is required' })
    .trim()
    .min(2,  { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' }),

  type: z
    .string({ required_error: 'Vehicle type is required' })
    .trim()
    .min(2,  { message: 'Type must be at least 2 characters' })
    .max(50, { message: 'Type must not exceed 50 characters' }),

  maxLoadCapacity: z
    .number({ required_error: 'Maximum load capacity is required', invalid_type_error: 'Maximum load capacity must be a number' })
    .positive({ message: 'Maximum load capacity must be greater than 0' }),

  odometer: z
    .number({ invalid_type_error: 'Odometer must be a number' })
    .nonnegative({ message: 'Odometer cannot be negative' })
    .optional(),

  acquisitionCost: z
    .number({ required_error: 'Acquisition cost is required', invalid_type_error: 'Acquisition cost must be a number' })
    .nonnegative({ message: 'Acquisition cost cannot be negative' }),

  region: z
    .string()
    .trim()
    .max(100, { message: 'Region must not exceed 100 characters' })
    .optional(),

  status: z
    .nativeEnum(VehicleStatus, {
      invalid_type_error: `Status must be one of: ${Object.values(VehicleStatus).join(', ')}`,
    })
    .optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

// ── Update Vehicle Body (PUT /vehicles/:id) ───────────────────────────────────
export const updateVehicleBodySchema = createVehicleSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided to update' },
  );

export type UpdateVehicleBodyInput = z.infer<typeof updateVehicleBodySchema>;

// ── Vehicle List Query (GET /vehicles) ────────────────────────────────────────
export const vehicleListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : undefined))
    .pipe(z.number().int().positive().optional()),

  limit: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : undefined))
    .pipe(z.number().int().positive().max(100).optional()),

  status: z
    .nativeEnum(VehicleStatus, {
      invalid_type_error: `Status must be one of: ${Object.values(VehicleStatus).join(', ')}`,
    })
    .optional(),

  type:   z.string().trim().optional(),
  region: z.string().trim().optional(),
});

export type VehicleListQueryInput = z.infer<typeof vehicleListQuerySchema>;

// ── Route Param: :id ──────────────────────────────────────────────────────────
export const vehicleIdParamSchema = z.object({
  id: z
    .string({ required_error: 'ID is required' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { message: 'Invalid MongoDB ObjectId' }),
});

export type VehicleIdParam = z.infer<typeof vehicleIdParamSchema>;
