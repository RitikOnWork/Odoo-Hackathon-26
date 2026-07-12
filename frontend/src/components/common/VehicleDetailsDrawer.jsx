const VehicleDetailsDrawer = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const statusStyles = {
    Running: 'bg-emerald-100 text-emerald-700',
    Idle: 'bg-amber-100 text-amber-700',
    Maintenance: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Vehicle Details</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{vehicle.id}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400">Close</button>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Driver</span>
          <span className="font-semibold text-slate-900 dark:text-white">{vehicle.driver}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Current Route</span>
          <span className="font-semibold text-slate-900 dark:text-white">{vehicle.route}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">ETA</span>
          <span className="font-semibold text-slate-900 dark:text-white">{vehicle.eta}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Fuel Level</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{vehicle.fuelLevel}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Speed</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{vehicle.speed} km/h</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current Trip</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{vehicle.trip}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[vehicle.status]}`}>{vehicle.status}</span>
      </div>
    </div>
  );
};

export default VehicleDetailsDrawer;
