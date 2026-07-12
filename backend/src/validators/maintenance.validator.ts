/**
 * validators/maintenance.validator.ts
 *
 * Zod schemas for all Maintenance-related API inputs.
 * Each schema is accompanied by its inferred TypeScript type.
 *
 * Schemas exported:
 *  - createMaintenanceSchema       → POST /maintenance
 *  - updateMaintenanceSchema       → PATCH /maintenance/:id
 *  - completeMaintenanceSchema     → PATCH /maintenance/:id/complete
 *  - maintenanceIdParamSchema      → route param :id validation
 */

import { z } from 'zod';
import { MaintenanceType, MaintenanceStatus } from '../constants/enums';

// ── Reusable helpers ──────────────────────────────────────────────────────────

const mongoId = z
  .string({ required_error: 'ID is required' })
  .trim()
  .regex(/^[a-f\d]{24}$/i, { message: 'Invalid MongoDB ObjectId' });

// ── Create Maintenance ────────────────────────────────────────────────────────
export const createMaintenanceSchema = z.object({
  vehicleId: mongoId.describe('vehicleId'),

  maintenanceType: z.nativeEnum(MaintenanceType, {
    required_error:    'Maintenance type is required',
    invalid_type_error: `Maintenance type must be one of: ${Object.values(MaintenanceType).join(', ')}`,
  }),

  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10,   { message: 'Description must be at least 10 characters' })
    .max(1000, { message: 'Description must not exceed 1000 characters' }),

  cost: z
    .number({ required_error: 'Cost is required', invalid_type_error: 'Cost must be a number' })
    .nonnegative({ message: 'Cost cannot be negative' })
    .multipleOf(0.01, { message: 'Cost can have at most 2 decimal places' }),

  startDate: z
    .string({ required_error: 'Start date is required' })
    .datetime({ message: 'startDate must be a valid ISO 8601 date-time string' })
    .transform((val) => new Date(val)),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;

// ── Update Maintenance (partial patch) ────────────────────────────────────────
export const updateMaintenanceSchema = z
  .object({
    maintenanceType: z
      .nativeEnum(MaintenanceType, {
        invalid_type_error: `Maintenance type must be one of: ${Object.values(MaintenanceType).join(', ')}`,
      })
      .optional(),

    description: z
      .string()
      .trim()
      .min(10,   { message: 'Description must be at least 10 characters' })
      .max(1000, { message: 'Description must not exceed 1000 characters' })
      .optional(),

    cost: z
      .number({ invalid_type_error: 'Cost must be a number' })
      .nonnegative({ message: 'Cost cannot be negative' })
      .multipleOf(0.01, { message: 'Cost can have at most 2 decimal places' })
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided to update' },
  );

export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;

// ── Complete Maintenance (close out the job) ──────────────────────────────────
export const completeMaintenanceSchema = z
  .object({
    endDate: z
      .string({ required_error: 'End date is required' })
      .datetime({ message: 'endDate must be a valid ISO 8601 date-time string' })
      .transform((val) => new Date(val)),

    cost: z
      .number({ invalid_type_error: 'Cost must be a number' })
      .nonnegative({ message: 'Cost cannot be negative' })
      .multipleOf(0.01, { message: 'Cost can have at most 2 decimal places' })
      .optional(),
  });

export type CompleteMaintenanceInput = z.infer<typeof completeMaintenanceSchema>;

// ── Update Status only ────────────────────────────────────────────────────────
export const updateMaintenanceStatusSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus, {
    required_error:    'Status is required',
    invalid_type_error: `Status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`,
  }),
});

export type UpdateMaintenanceStatusInput = z.infer<typeof updateMaintenanceStatusSchema>;

// ── Route Param: :id ──────────────────────────────────────────────────────────
export const maintenanceIdParamSchema = z.object({
  id: mongoId.describe('Maintenance ID param'),
});

export type MaintenanceIdParam = z.infer<typeof maintenanceIdParamSchema>;
