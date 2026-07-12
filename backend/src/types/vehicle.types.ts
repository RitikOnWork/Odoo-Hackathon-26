/**
 * types/vehicle.types.ts
 * TypeScript interfaces for the Vehicle domain.
 */

import { Document } from 'mongoose';
import { VehicleStatus } from '../constants/enums';

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

export interface IVehicleDocument extends IVehicle, Document {
  createdAt: Date;
  updatedAt: Date;
}
