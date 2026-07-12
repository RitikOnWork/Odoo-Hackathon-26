/**
 * types/trip.types.ts
 * TypeScript interfaces for the Trip domain.
 */

import { Document, Types } from 'mongoose';
import { TripStatus } from '../constants/enums';

// ── Plain data shape (used in services, validators, DTOs) ─────────────────────
export interface ITrip {
  tripNumber:       string;
  source:           string;
  destination:      string;
  vehicle:          Types.ObjectId;
  driver:           Types.ObjectId;
  cargoWeight:      number;          // in kg
  plannedDistance:  number;          // in km
  actualDistance?:  number;          // in km — filled on completion
  finalOdometer?:   number;          // in km — odometer reading at trip end
  fuelConsumed?:    number;          // in litres — filled on completion
  status:           TripStatus;
  dispatchedAt?:    Date;
  completedAt?:     Date;
}

// ── Mongoose Document (extends ITrip + Document for model usage) ───────────────
export interface ITripDocument extends ITrip, Document {
  createdAt: Date;
  updatedAt: Date;
}
