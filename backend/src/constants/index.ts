/**
 * constants/
 *
 * Purpose: Application-wide magic-number-free named constants.
 *
 * What goes here:
 *  - httpStatus.ts    → HTTP status codes enum (200, 201, 400, 401, 403, 404, 500)
 *  - roles.ts         → User role enum (ADMIN, DRIVER, OPERATOR)
 *  - vehicleStatus.ts → Vehicle status enum (ACTIVE, IDLE, MAINTENANCE, RETIRED)
 *  - tripStatus.ts    → Trip status enum (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
 *  - messages.ts      → Reusable user-facing message strings
 *
 * Rule:
 *  - Only primitive values, enums, and readonly objects.
 *  - No functions, no imports from other src folders.
 *  - Import constants; never hard-code strings/numbers directly in logic files.
 */
