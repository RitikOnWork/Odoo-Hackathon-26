export const maintenanceData = [
  {
    id: 1,
    vehicle: 'BUS-305',
    serviceType: 'Brake Inspection',
    scheduledDate: '2026-07-14',
    technician: 'James Otieno',
    estimatedCost: '$780',
    status: 'Scheduled',
  },
  {
    id: 2,
    vehicle: 'VT-701',
    serviceType: 'Oil Change',
    scheduledDate: '2026-07-16',
    technician: 'Grace Wambui',
    estimatedCost: '$220',
    status: 'In Progress',
  },
  {
    id: 3,
    vehicle: 'TR-344',
    serviceType: 'Tire Replacement',
    scheduledDate: '2026-07-10',
    technician: 'Moses Kibet',
    estimatedCost: '$540',
    status: 'Completed',
  },
  {
    id: 4,
    vehicle: 'VT-503',
    serviceType: 'Engine Diagnostics',
    scheduledDate: '2026-07-18',
    technician: 'Lilian Sila',
    estimatedCost: '$1,240',
    status: 'Scheduled',
  },
  {
    id: 5,
    vehicle: 'TR-118',
    serviceType: 'Battery Check',
    scheduledDate: '2026-07-12',
    technician: 'Kevin Mwangi',
    estimatedCost: '$150',
    status: 'Completed',
  },
];

export const maintenanceTypes = ['All', 'Brake Inspection', 'Oil Change', 'Tire Replacement', 'Engine Diagnostics', 'Battery Check'];
export const maintenanceStatuses = ['All', 'Scheduled', 'In Progress', 'Completed'];
