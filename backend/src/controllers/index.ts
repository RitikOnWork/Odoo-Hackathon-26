/**
 * controllers/
 *
 * Purpose: HTTP request/response handlers — the "C" in MVC.
 *
 * What goes here:
 *  - auth.controller.ts     → register, login, logout, refreshToken
 *  - vehicle.controller.ts  → CRUD for fleet vehicles
 *  - driver.controller.ts   → CRUD for drivers
 *  - route.controller.ts    → CRUD for transit routes
 *  - trip.controller.ts     → Trip scheduling and status updates
 *
 * Rule:
 *  - Controllers ONLY parse req/res, call the appropriate service, and return
 *    a structured response. They contain NO database queries or business rules.
 *  - Keep each controller thin — delegate all logic to services/.
 */
