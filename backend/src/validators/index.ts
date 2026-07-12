/**
 * validators/
 *
 * Purpose: Zod schemas for runtime input validation of all incoming request data.
 *
 * What goes here:
 *  - auth.validator.ts     → registerSchema, loginSchema
 *  - vehicle.validator.ts  → createVehicleSchema, updateVehicleSchema
 *  - driver.validator.ts   → createDriverSchema, updateDriverSchema
 *  - route.validator.ts    → createRouteSchema, updateRouteSchema
 *  - trip.validator.ts     → createTripSchema, updateTripStatusSchema
 *
 * Rule:
 *  - Each schema file exports typed Zod schemas AND the inferred TypeScript types
 *    (e.g. export type RegisterInput = z.infer<typeof registerSchema>).
 *  - Schemas are consumed by the validate.middleware.ts factory.
 *  - No direct mongoose or DB imports here — pure data-shape definitions only.
 */
