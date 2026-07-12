/**
 * config/
 *
 * Purpose: Centralised application configuration.
 *
 * What goes here:
 *  - db.ts          → Mongoose connection setup (connect / disconnect helpers)
 *  - env.ts         → Typed, validated environment variables (using zod or dotenv)
 *  - jwt.ts         → JWT secret / expiry constants pulled from env
 *  - cors.ts        → CORS options object passed to the cors() middleware
 *  - logger.ts      → Logger initialisation (e.g. winston / pino)
 *
 * Rule: No business logic lives here — only wiring and settings.
 */
