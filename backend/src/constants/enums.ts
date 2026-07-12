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
