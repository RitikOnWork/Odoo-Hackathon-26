/**
 * controllers/vehicle.controller.ts
 *
 * HTTP layer for Vehicle endpoints.
 * No business logic lives here — controllers are intentionally thin.
 */

import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicle.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { CreateVehicleInput, UpdateVehicleBodyInput, VehicleListQueryInput } from '../validators/vehicle.validator';

// ── POST /api/vehicles ────────────────────────────────────────────────────────
export const createVehicle = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const input   = req.body as CreateVehicleInput;
    const vehicle = await vehicleService.createVehicle(input);

    res.status(201).json(
      new ApiResponse(201, vehicle, `Vehicle ${vehicle.registrationNumber} created successfully`),
    );
  },
);

// ── GET /api/vehicles ──────────────────────────────────────────────────────────
export const getAllVehicles = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query  = req.query as unknown as VehicleListQueryInput;
    const result = await vehicleService.getAllVehicles(query);

    res.status(200).json(
      new ApiResponse(200, result, 'Vehicles fetched successfully'),
    );
  },
);

// ── GET /api/vehicles/:id ──────────────────────────────────────────────────────
export const getVehicleById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const vehicle = await vehicleService.getVehicleById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, vehicle, 'Vehicle fetched successfully'),
    );
  },
);

// ── PUT /api/vehicles/:id ──────────────────────────────────────────────────────
export const updateVehicle = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload = req.body as UpdateVehicleBodyInput;
    const vehicle = await vehicleService.updateVehicle(req.params.id, payload);

    res.status(200).json(
      new ApiResponse(200, vehicle, `Vehicle ${vehicle.registrationNumber} updated successfully`),
    );
  },
);

// ── DELETE /api/vehicles/:id ────────────────────────────────────────────────────
export const deleteVehicle = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await vehicleService.deleteVehicle(req.params.id);

    res.status(200).json(
      new ApiResponse(200, result, `Vehicle ${result.registrationNumber} deleted successfully`),
    );
  },
);
