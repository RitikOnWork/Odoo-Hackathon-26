import { useMemo, useState } from 'react';
import { FiDroplet, FiDollarSign, FiTrendingUp, FiZap } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ActionButtons from '../components/common/ActionButtons';
import Modal from '../components/common/Modal';
import { fuelLogsData, fuelTypes, fuelVehicles } from '../data/fuelLogs';

const FuelLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return fuelLogsData.filter((log) => {
      const matchesSearch = `${log.vehicleId} ${log.driverName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVehicle = vehicleFilter === 'All' || log.vehicleId === vehicleFilter;
      const matchesFuelType = fuelTypeFilter === 'All' || log.fuelType === fuelTypeFilter;
      return matchesSearch && matchesVehicle && matchesFuelType;
    });
  }, [searchTerm, vehicleFilter, fuelTypeFilter]);

  const summaryCards = [
    { title: 'Total Fuel Consumed', value: '45,280 Litres', status: 'Across fleet', icon: FiDroplet, accent: 'from-sky-500 to-blue-600' },
    { title: 'Total Fuel Cost', value: '₹8,45,000', status: 'This month', icon: FiDollarSign, accent: 'from-emerald-500 to-green-600' },
    { title: 'Average Mileage', value: '6.8 km/L', status: 'Fleet average', icon: FiTrendingUp, accent: 'from-violet-500 to-fuchsia-600' },
    { title: 'Fuel Efficiency Score', value: '87%', status: 'Optimal range', icon: FiZap, accent: 'from-amber-500 to-orange-500' },
  ];

  const columns = ['Log ID', 'Vehicle ID', 'Driver Name', 'Fuel Type', 'Quantity', 'Cost', 'Mileage', 'Date', 'Location', 'Actions'];

  const renderRow = (log) => (
    <tr key={log.id} className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{log.id}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.vehicleId}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.driverName}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.fuelType}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.quantity}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.cost}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.mileage}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.date}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{log.location}</td>
      <td className="px-4 py-4"><ActionButtons onView={() => setSelectedLog(log)} onEdit={() => setSelectedLog(log)} onDelete={() => setSelectedLog(log)} /></td>
    </tr>
  );

  const renderMobileCard = (log) => (
    <div key={log.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{log.id}</p>
          <p className="mt-1 text-sm text-slate-500">{log.vehicleId} • {log.driverName}</p>
        </div>
        <StatusBadge status={log.fuelType} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Quantity</span><span>{log.quantity}</span></div>
        <div className="flex items-center justify-between"><span>Cost</span><span>{log.cost}</span></div>
        <div className="flex items-center justify-between"><span>Mileage</span><span>{log.mileage}</span></div>
        <div className="flex items-center justify-between"><span>Location</span><span>{log.location}</span></div>
      </div>
      <div className="mt-4"><ActionButtons onView={() => setSelectedLog(log)} onEdit={() => setSelectedLog(log)} onDelete={() => setSelectedLog(log)} /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Fuel Logs" subtitle="Track fuel consumption, mileage, and vehicle efficiency" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          { label: 'Vehicle', value: vehicleFilter, onChange: (event) => setVehicleFilter(event.target.value), options: fuelVehicles, placeholder: 'All Vehicles' },
          { label: 'Fuel Type', value: fuelTypeFilter, onChange: (event) => setFuelTypeFilter(event.target.value), options: fuelTypes, placeholder: 'All Fuel Types' },
        ]}
        buttonLabel="Add Fuel Log"
        onAddClick={() => setSelectedLog(null)}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Fuel Activity</h2>
            <p className="text-sm text-slate-500">{filteredLogs.length} logs visible</p>
          </div>
        </div>
        <DataTable columns={columns} rows={filteredLogs} renderRow={renderRow} renderMobileCard={renderMobileCard} />
      </div>

      <Modal isOpen={Boolean(selectedLog)} title="Fuel Log Details" onClose={() => setSelectedLog(null)}>
        {selectedLog ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Vehicle</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.vehicleId}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Driver</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.driverName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Fuel Quantity</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.quantity}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Fuel Cost</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.cost}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Mileage Before / After</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.mileageBefore} → {selectedLog.mileageAfter}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Location & Date</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.location} • {selectedLog.date}</p>
            </div>
            <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Notes</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedLog.notes}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default FuelLogsPage;
