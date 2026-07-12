/**
 * types/vehicle.types.ts
 * TypeScript interfaces for the Vehicle domain.
 */

import { Document } from 'mongoose';
import { VehicleStatus } from '../constants/enums';

<<<<<<< HEAD
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
=======
export interface IVehicle {
  plateNumber:     string;
  make:            string;
  vehicleModel:    string;   // renamed from 'model' to avoid conflict with Mongoose Document.model()
  year:            number;
  type:            string;   // e.g. Truck, Van, Flatbed
  capacity:        number;   // payload capacity in kg
  currentOdometer: number;   // km
  status:          VehicleStatus;
}

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
export interface IVehicleDocument extends IVehicle, Document {
  createdAt: Date;
  updatedAt: Date;
}
