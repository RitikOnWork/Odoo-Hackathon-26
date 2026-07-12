/**
 * types/
 *
 * Purpose: Shared TypeScript interfaces, types, and augmented Express typings.
 *
 * What goes here:
 *  - express.d.ts       → Module augmentation: adds `user` to Express.Request
 *  - user.types.ts      → IUser interface (mirrors the User Mongoose document)
 *  - vehicle.types.ts   → IVehicle interface
 *  - driver.types.ts    → IDriver interface
 *  - route.types.ts     → IRoute interface
 *  - trip.types.ts      → ITrip interface
 *  - pagination.types.ts → PaginatedResult<T> generic
 *  - jwt.types.ts       → JwtPayload interface
 *
 * Rule:
 *  - No runtime code — only type/interface/enum declarations.
 *  - Types shared between multiple layers (models + services + controllers)
 *    live here, not inside any single layer folder.
 */
