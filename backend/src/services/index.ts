/**
 * services/
 *
 * Purpose: Business logic layer — the brain of the application.
 *
 * What goes here:
 *  - auth.service.ts     → register/login logic, token generation, bcrypt hashing
 *  - vehicle.service.ts  → fleet management operations
 *  - driver.service.ts   → driver assignment, availability checks
 *  - route.service.ts    → route optimisation, stop management
 *  - trip.service.ts     → trip lifecycle (schedule → active → completed)
 *  - notification.service.ts → send alerts / push notifications
 *
 * Rule:
 *  - Services talk to Models (database) but never to req/res (HTTP).
 *  - Controllers call services; services call models.
 *  - Complex orchestration that spans multiple models lives in services.
 *  - All async functions must propagate errors (throw, not swallow).
 */
