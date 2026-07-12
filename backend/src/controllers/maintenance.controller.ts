/**
 * controllers/maintenance.controller.ts
 *
 * HTTP/Controller layer for Maintenance endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import * as maintenanceService from '../services/maintenance.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { MaintenanceStatus } from '../constants/enums';
import { CreateMaintenanceInput, UpdateMaintenanceInput, CompleteMaintenanceInput } from '../validators/maintenance.validator';

// ── POST /api/maintenance ─────────────────────────────────────────────────────
export const createMaintenance = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const input = req.body as CreateMaintenanceInput;
    const result = await maintenanceService.createMaintenance(input);

    res.status(201).json(
      new ApiResponse(201, result, 'Maintenance log created successfully'),
    );
  },
);


// ── GET /api/maintenance ──────────────────────────────────────────────────────
export const getAllMaintenance = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { status, page, limit } = req.query;

    const result = await maintenanceService.getAllMaintenance({
      status: status as MaintenanceStatus | undefined,
      page:   page  ? Number(page)  : undefined,
      limit:  limit ? Number(limit) : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Maintenance logs fetched successfully'),
    );
  },
);

// ── GET /api/maintenance/:id ──────────────────────────────────────────────────
export const getMaintenanceById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const log = await maintenanceService.getMaintenanceById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, log, 'Maintenance log fetched successfully'),
    );
  },
);

// ── PUT /api/maintenance/:id ──────────────────────────────────────────────────
export const updateMaintenance = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload = req.body as UpdateMaintenanceInput;
    const log     = await maintenanceService.updateMaintenance(req.params.id, payload);

    res.status(200).json(
      new ApiResponse(200, log, 'Maintenance log updated successfully'),
    );
  },
);

// ── DELETE /api/maintenance/:id ───────────────────────────────────────────────
export const deleteMaintenance = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await maintenanceService.deleteMaintenance(req.params.id);

    res.status(200).json(
      new ApiResponse(200, result, 'Maintenance log deleted successfully'),
    );
  },
);

// ── PATCH /api/maintenance/:id/complete ───────────────────────────────────────
export const completeMaintenance = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload = req.body as CompleteMaintenanceInput;
    const result  = await maintenanceService.completeMaintenance(req.params.id, payload);

    res.status(200).json(
      new ApiResponse(200, result, 'Maintenance log completed successfully'),
    );
  },
);

