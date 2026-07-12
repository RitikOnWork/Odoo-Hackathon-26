/**
 * utils/ApiResponse.ts
 *
 * Standardised success response builder.
 * All successful API responses use this shape for consistency.
 *
 * Shape:
 *   {
 *     "success": true,
 *     "statusCode": 200,
 *     "message": "Trips fetched successfully",
 *     "data": { ... }
 *   }
 *
 * Usage:
 *   res.status(201).json(new ApiResponse(201, trip, 'Trip created'));
 */

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;

  constructor(statusCode: number, data: T, message = 'Success') {
    this.success    = statusCode < 400;
    this.statusCode = statusCode;
    this.message    = message;
    this.data       = data;
  }
}
