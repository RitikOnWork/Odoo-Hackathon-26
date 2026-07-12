import VehicleRow from './VehicleRow';

const VehicleTable = ({ vehicles }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vehicle Number</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vehicle Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fuel Level</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Region</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {vehicles.map((vehicle) => (
              <VehicleRow key={vehicle.id} vehicle={vehicle} view="table" />
            ))}
          </tbody>
        </table>
      </div>

      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vehicle</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Type</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fuel</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="transition hover:bg-slate-50">
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">{vehicle.vehicleNumber}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{vehicle.type}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : vehicle.status === 'Available' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-slate-600">{vehicle.fuelLevel}%</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      <span className="sr-only">View</span>
                      <span className="text-sm">👁</span>
                    </button>
                    <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      <span className="sr-only">Edit</span>
                      <span className="text-sm">✎</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block space-y-3 p-3 md:hidden">
        {vehicles.map((vehicle) => (
          <VehicleRow key={vehicle.id} vehicle={vehicle} view="mobile" />
        ))}
      </div>
    </div>
  );
};

export default VehicleTable;
