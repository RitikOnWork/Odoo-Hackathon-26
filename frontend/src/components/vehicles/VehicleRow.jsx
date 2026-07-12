import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700',
  Available: 'bg-sky-50 text-sky-700',
  Maintenance: 'bg-amber-50 text-amber-700',
};

const VehicleRow = ({ vehicle, view = 'table' }) => {
  const fuelWidth = `${Math.min(vehicle.fuelLevel, 100)}%`;

  if (view === 'mobile') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{vehicle.vehicleNumber}</p>
            <p className="mt-1 text-sm text-slate-500">{vehicle.type} • {vehicle.driver}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[vehicle.status]}`}>
            {vehicle.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Fuel Level</span>
            <span className="font-semibold text-slate-900">{vehicle.fuelLevel}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-slate-900" style={{ width: fuelWidth }} />
          </div>
          <div className="flex items-center justify-between">
            <span>Last Service</span>
            <span>{vehicle.lastService}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Region</span>
            <span>{vehicle.region}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <span className="flex items-center justify-center gap-2">
              <FiEye /> View
            </span>
          </button>
          <button type="button" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <span className="flex items-center justify-center gap-2">
              <FiEdit2 /> Edit
            </span>
          </button>
          <button type="button" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <span className="flex items-center justify-center gap-2">
              <FiTrash2 /> Delete
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{vehicle.vehicleNumber}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.type}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.driver}</td>
      <td className="px-4 py-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[vehicle.status]}`}>
          {vehicle.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="min-w-[110px]">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>{vehicle.fuelLevel}%</span>
            <span>{vehicle.fuelLevel > 70 ? 'Healthy' : 'Refill'}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-slate-900" style={{ width: fuelWidth }} />
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.lastService}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.region}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="View vehicle">
            <FiEye />
          </button>
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Edit vehicle">
            <FiEdit2 />
          </button>
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Delete vehicle">
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VehicleRow;
