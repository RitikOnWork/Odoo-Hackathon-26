/**
 * types/vehicle.types.ts
 * TypeScript interfaces for the Vehicle domain.
 */

import { Document } from 'mongoose';
import { VehicleStatus } from '../constants/enums';

// ── Plain data shape (used in services, validators, DTOs) ─────────────────────
export interface IVehicle {
  registrationNumber: string;          // unique
  name:               string;          // vehicle name/model
  type:               string;          // e.g. Truck, Van, Bike
  maxLoadCapacity:    number;          // in kg
  odometer:           number;          // in km
  acquisitionCost:    number;
  region?:            string;          // used by dashboard filters
  status:             VehicleStatus;
}

// ── Mongoose Document (extends IVehicle + Document for model usage) ────────────
export interface IVehicleDocument extends IVehicle, Document {
  createdAt: Date;
  updatedAt: Date;
}
