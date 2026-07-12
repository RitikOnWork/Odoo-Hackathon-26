/**
 * utils/ApiError.ts
 *
 * Custom error class that carries an HTTP status code alongside the message.
 * Thrown by services and caught by the centralised error-handler middleware.
 *
 * Usage:
 *   throw new ApiError(404, 'Trip not found');
 *   throw new ApiError(400, 'Invalid input', errors);
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    isOperational = true,
  ) {
    super(message);
    this.name       = 'ApiError';
    this.statusCode = statusCode;
    this.errors     = errors;
    this.isOperational = isOperational;

    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
