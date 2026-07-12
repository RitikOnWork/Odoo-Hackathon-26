/**
 * controllers/trip.controller.ts
 *
 * HTTP layer for Trip endpoints.
 * Responsibilities:
 *  1. Parse and pass validated request data to the service.
 *  2. Send a structured ApiResponse on success.
 *  3. Delegate all errors to next() — caught by errorHandler middleware.
 *
 * No business logic lives here — controllers are intentionally thin.
 */

import { Request, Response, NextFunction } from 'express';
import * as tripService from '../services/trip.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { TripStatus } from '../constants/enums';
import { CreateTripInput } from '../validators/trip.validator';
import { UpdateTripPayload } from '../services/trip.service';

// ── POST /api/trips ───────────────────────────────────────────────────────────
export const createTrip = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const input = req.body as CreateTripInput;
    const trip  = await tripService.createTrip(input);

    res.status(201).json(
      new ApiResponse(201, trip, `Trip ${trip.tripNumber} created successfully`),
    );
  },
);

// ── GET /api/trips ────────────────────────────────────────────────────────────
export const getAllTrips = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { status, page, limit } = req.query;

    const result = await tripService.getAllTrips({
      status: status as TripStatus | undefined,
      page:   page  ? Number(page)  : undefined,
      limit:  limit ? Number(limit) : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Trips fetched successfully'),
    );
  },
);

// ── GET /api/trips/:id ────────────────────────────────────────────────────────
export const getTripById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const trip = await tripService.getTripById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, trip, 'Trip fetched successfully'),
    );
  },
);

// ── PUT /api/trips/:id ────────────────────────────────────────────────────────
export const updateTrip = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload = req.body as UpdateTripPayload;
    const trip    = await tripService.updateTrip(req.params.id, payload);

    res.status(200).json(
      new ApiResponse(200, trip, `Trip ${trip.tripNumber} updated successfully`),
    );
  },
);

// ── DELETE /api/trips/:id ─────────────────────────────────────────────────────
export const deleteTrip = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await tripService.deleteTrip(req.params.id);

    res.status(200).json(
      new ApiResponse(200, result, `Trip ${result.tripNumber} deleted successfully`),
    );
  },
);
