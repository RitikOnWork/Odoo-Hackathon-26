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
