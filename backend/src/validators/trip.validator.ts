/**
 * validators/trip.validator.ts
 *
 * Zod schemas for all Trip-related API inputs.
 * Each schema is accompanied by its inferred TypeScript type.
 *
 * Schemas exported:
 *  - createTripSchema          → POST /trips
 *  - updateTripBodySchema      → PUT /trips/:id
 *  - updateTripStatusSchema    → (internal utility)
 *  - completeTripSchema        → PATCH /trips/:id/complete
 *  - tripHistoryQuerySchema    → GET /trips/history
 *  - tripIdParamSchema         → route param :id validation
 */

import { z } from 'zod';
import { TripStatus } from '../constants/enums';

// ── Reusable helpers ──────────────────────────────────────────────────────────

/**
 * Validates a 24-character hexadecimal MongoDB ObjectId string.
 * Applied to vehicleId and driverId so bad IDs are rejected before
 * they reach the database layer.
 */
const mongoId = z
  .string({ required_error: 'ID is required' })
  .trim()
  .regex(/^[a-f\d]{24}$/i, { message: 'Invalid MongoDB ObjectId' });

// ── Create Trip ───────────────────────────────────────────────────────────────
export const createTripSchema = z.object({
  source: z
    .string({ required_error: 'Source location is required' })
    .trim()
    .min(2,  { message: 'Source must be at least 2 characters' })
    .max(200, { message: 'Source must not exceed 200 characters' }),

  destination: z
    .string({ required_error: 'Destination is required' })
    .trim()
    .min(2,  { message: 'Destination must be at least 2 characters' })
    .max(200, { message: 'Destination must not exceed 200 characters' }),

  vehicleId: mongoId.describe('vehicleId'),

  driverId: mongoId.describe('driverId'),

  cargoWeight: z
    .number({ required_error: 'Cargo weight is required', invalid_type_error: 'Cargo weight must be a number' })
    .positive({ message: 'Cargo weight must be greater than 0' })
    .multipleOf(0.01, { message: 'Cargo weight can have at most 2 decimal places' }),

  plannedDistance: z
    .number({ required_error: 'Planned distance is required', invalid_type_error: 'Planned distance must be a number' })
    .positive({ message: 'Planned distance must be greater than 0' })
    .multipleOf(0.01, { message: 'Planned distance can have at most 2 decimal places' }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

// ── Update Trip Body (PUT /trips/:id) ─────────────────────────────────────────
// All fields optional; at least one must be provided.
export const updateTripBodySchema = createTripSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided to update' },
  );

export type UpdateTripBodyInput = z.infer<typeof updateTripBodySchema>;

// ── Update Trip Status ────────────────────────────────────────────────────────
export const updateTripStatusSchema = z.object({
  status: z.nativeEnum(TripStatus, {
    required_error: 'Status is required',
    invalid_type_error: `Status must be one of: ${Object.values(TripStatus).join(', ')}`,
  }),
});

export type UpdateTripStatusInput = z.infer<typeof updateTripStatusSchema>;

// ── Complete Trip (add actuals at closure) ────────────────────────────────────
export const completeTripSchema = z.object({
  actualDistance: z
    .number({ required_error: 'Actual distance is required', invalid_type_error: 'Actual distance must be a number' })
    .positive({ message: 'Actual distance must be greater than 0' })
    .multipleOf(0.01, { message: 'Actual distance can have at most 2 decimal places' }),

  finalOdometer: z
    .number({ required_error: 'Final odometer reading is required', invalid_type_error: 'Final odometer must be a number' })
    .nonnegative({ message: 'Final odometer cannot be negative' }),

  fuelConsumed: z
    .number({ required_error: 'Fuel consumed is required', invalid_type_error: 'Fuel consumed must be a number' })
    .positive({ message: 'Fuel consumed must be greater than 0' })
    .multipleOf(0.001, { message: 'Fuel consumed can have at most 3 decimal places' }),
});

export type CompleteTripInput = z.infer<typeof completeTripSchema>;

// ── Trip History Query (GET /trips/history) ───────────────────────────────────
// All fields are optional. Query strings come in as strings, so numeric fields
// use coerce to convert them before validation.
export const tripHistoryQuerySchema = z.object({
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

  search: z.string().trim().min(1).max(200).optional(),

  status: z
    .nativeEnum(TripStatus, {
      invalid_type_error: `status must be one of: ${Object.values(TripStatus).join(', ')}`,
    })
    .optional(),

  vehicle: mongoId.optional(),
  driver:  mongoId.optional(),

  sortBy: z
    .enum(['createdAt', 'completedAt'], {
      invalid_type_error: "sortBy must be 'createdAt' or 'completedAt'",
    })
    .optional(),

  sortOrder: z
    .enum(['asc', 'desc'], {
      invalid_type_error: "sortOrder must be 'asc' or 'desc'",
    })
    .optional(),
});

export type TripHistoryQuery = z.infer<typeof tripHistoryQuerySchema>;

// ── Route Param: :id ──────────────────────────────────────────────────────────
export const tripIdParamSchema = z.object({
  id: mongoId.describe('Trip ID param'),
});

export type TripIdParam = z.infer<typeof tripIdParamSchema>;
