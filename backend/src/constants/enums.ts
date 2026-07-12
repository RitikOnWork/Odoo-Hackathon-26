/**
 * constants/enums.ts
 * Application-wide enum definitions — single source of truth for all status values.
 */

// ── Trip ─────────────────────────────────────────────────────────────────────
export enum TripStatus {
  DRAFT      = 'Draft',
  DISPATCHED = 'Dispatched',
  COMPLETED  = 'Completed',
  CANCELLED  = 'Cancelled',
}

// ── Maintenance ───────────────────────────────────────────────────────────────
export enum MaintenanceStatus {
  ACTIVE    = 'Active',
  COMPLETED = 'Completed',
}

export enum MaintenanceType {
  PREVENTIVE  = 'Preventive',
  CORRECTIVE  = 'Corrective',
  PREDICTIVE  = 'Predictive',
  EMERGENCY   = 'Emergency',
  INSPECTION  = 'Inspection',
}

<<<<<<< HEAD
// ── User / Auth ────────────────────────────────────────────────────────────────
export enum UserRole {
  FLEET_MANAGER     = 'Fleet Manager',
  DRIVER            = 'Driver',
  SAFETY_OFFICER    = 'Safety Officer',
  FINANCIAL_ANALYST = 'Financial Analyst',
}

// ── Vehicle ───────────────────────────────────────────────────────────────────
export enum VehicleStatus {
  AVAILABLE = 'Available',
  ON_TRIP   = 'On Trip',
  IN_SHOP   = 'In Shop',
  RETIRED   = 'Retired',
}

// ── Driver (fleet driver profile) ─────────────────────────────────────────────
export enum DriverStatus {
  AVAILABLE = 'Available',
  ON_TRIP   = 'On Trip',
  OFF_DUTY  = 'Off Duty',
  SUSPENDED = 'Suspended',
}
=======
// ── Vehicle ───────────────────────────────────────────────────────────────────
export enum VehicleStatus {
  AVAILABLE = 'Available',
  IN_SHOP   = 'In Shop',   // under maintenance — cannot be dispatched
  ON_TRIP   = 'On Trip',   // currently active on a trip
  RETIRED   = 'Retired',   // permanently decommissioned
}

// ── Driver ────────────────────────────────────────────────────────────────────
export enum DriverStatus {
  AVAILABLE = 'Available',
  ON_TRIP   = 'On Trip',   // currently assigned to an active trip
  ON_LEAVE  = 'On Leave',  // temporary leave — cannot be dispatched
  SUSPENDED = 'Suspended', // disciplinary / compliance hold
}

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
