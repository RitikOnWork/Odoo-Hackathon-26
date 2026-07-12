/**
 * routes/
 *
 * Purpose: Express Router definitions — maps HTTP verbs + paths to controllers.
 *
 * What goes here:
 *  - index.ts          → Master router: aggregates and mounts all sub-routers
 *  - auth.routes.ts    → POST /auth/register, POST /auth/login, POST /auth/refresh
 *  - vehicle.routes.ts → GET|POST /vehicles, GET|PATCH|DELETE /vehicles/:id
 *  - driver.routes.ts  → GET|POST /drivers,  GET|PATCH|DELETE /drivers/:id
 *  - route.routes.ts   → GET|POST /routes,   GET|PATCH|DELETE /routes/:id
 *  - trip.routes.ts    → GET|POST /trips,    GET|PATCH|DELETE /trips/:id
 *
 * Rule:
 *  - Routes are ONLY responsible for: path matching, middleware chaining
 *    (auth, validation), and delegating to the right controller method.
 *  - No logic beyond that belongs here.
 */
