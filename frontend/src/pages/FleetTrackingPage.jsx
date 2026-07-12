import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Bus, Filter, Gauge, RefreshCw, Search } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { fleetSummary, fleetVehicles } from '../data/fleetTracking';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import MapCard from '../components/common/MapCard';
import VehicleDetailsDrawer from '../components/common/VehicleDetailsDrawer';

const FleetTrackingPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(fleetVehicles[0]);
  const summaryIconMap = {
    'Total Vehicles': Bus,
    'Vehicles Running': Activity,
    'Vehicles Idle': Gauge,
    'Emergency Alerts': AlertTriangle,
  };
  const accentMap = {
    'Total Vehicles': 'from-sky-500 to-blue-600',
    'Vehicles Running': 'from-emerald-500 to-green-600',
    'Vehicles Idle': 'from-amber-500 to-orange-500',
    'Emergency Alerts': 'from-rose-500 to-pink-600',
  };
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  const filteredVehicles = useMemo(() => {
    return fleetVehicles.filter((vehicle) => {
      const matchesSearch = vehicle.id.toLowerCase().includes(search.toLowerCase()) || vehicle.driver.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div>
      <PageHeader title="Live Fleet Tracking" subtitle="Monitor your entire fleet in real time." action={<button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Refresh</button>} />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fleetSummary.map((item) => (
          <SummaryCard key={item.title} title={item.title} value={item.value} status={item.detail} icon={summaryIconMap[item.title]} accent={accentMap[item.title]} />
        ))}
      </div>

      <MapCard
        title="Live Fleet Map"
        subtitle="Dummy vehicle positions with real-time style telemetry"
        controls={
          <>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicle" className="w-32 border-0 bg-transparent outline-none" />
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Filter size={16} />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border-0 bg-transparent outline-none">
                <option value="All">All Status</option>
                <option value="Running">Running</option>
                <option value="Idle">Idle</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </label>
            <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <RefreshCw size={16} className="inline" />
            </button>
          </>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="h-[520px] overflow-hidden rounded-[20px] border border-slate-200 dark:border-slate-700">
            {isMapReady ? (
              <MapContainer center={[12.97, 77.61]} zoom={12} scrollWheelZoom className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                {filteredVehicles.map((vehicle) => {
                  const safeCoordinates = Array.isArray(vehicle.coordinates) && vehicle.coordinates.length === 2 ? [Number(vehicle.coordinates[0]), Number(vehicle.coordinates[1])] : [12.97, 77.61];

                  return (
                    <Marker key={vehicle.id} position={safeCoordinates} eventHandlers={{ click: () => setSelectedVehicle(vehicle) }}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{vehicle.id}</p>
                          <p>{vehicle.driver}</p>
                          <p className="mt-1">{vehicle.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">Preparing fleet map…</div>
            )}
          </div>

          <VehicleDetailsDrawer vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
        </div>
      </MapCard>
    </div>
  );
};

export default FleetTrackingPage;
