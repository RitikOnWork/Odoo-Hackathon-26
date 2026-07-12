const statusStyles = {
  'On Duty': 'bg-emerald-50 text-emerald-700',
  'Off Duty': 'bg-sky-50 text-sky-700',
  Leave: 'bg-amber-50 text-amber-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Available: 'bg-sky-50 text-sky-700',
  Maintenance: 'bg-amber-50 text-amber-700',
  Scheduled: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-violet-50 text-violet-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-rose-50 text-rose-700',
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
