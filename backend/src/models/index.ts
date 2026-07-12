/**
 * models/
 *
 * Purpose: Mongoose schema definitions and compiled Model objects.
 *
 * What goes here:
 *  - User.model.ts     → User schema (email, password hash, role)
 *  - Vehicle.model.ts  → Vehicle schema (plate, type, capacity, status)
 *  - Driver.model.ts   → Driver schema (license, assigned vehicle, status)
 *  - Route.model.ts    → Route schema (stops, schedule, distance)
 *  - Trip.model.ts     → Trip schema (route ref, driver ref, timestamps)
 *
 * Rule:
 *  - One file per collection.
 *  - Export both the Mongoose Document interface AND the compiled Model.
 *  - Pre-save hooks (e.g. password hashing) and instance methods live here.
 */
