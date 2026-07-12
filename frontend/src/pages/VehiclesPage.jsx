import { useMemo, useState } from 'react';
import { FiTruck, FiTool, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import SearchFilterBar from '../components/vehicles/SearchFilterBar';
import VehicleSummaryCard from '../components/vehicles/VehicleSummaryCard';
import VehicleTable from '../components/vehicles/VehicleTable';
import { vehicleData, vehicleStatuses, vehicleTypes } from '../constants/vehicles';

const VehiclesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredVehicles = useMemo(() => {
    return vehicleData.filter((vehicle) => {
      const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const summaryCards = [
    {
      title: 'Total Vehicles',
      value: vehicleData.length,
      status: 'Fleet coverage',
      icon: FiTruck,
      accent: 'from-slate-700 to-slate-900',
    },
    {
      title: 'Active',
      value: vehicleData.filter((vehicle) => vehicle.status === 'Active').length,
      status: 'In transit',
      icon: FiTrendingUp,
      accent: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Available',
      value: vehicleData.filter((vehicle) => vehicle.status === 'Available').length,
      status: 'Ready for dispatch',
      icon: FiMapPin,
      accent: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Maintenance',
      value: vehicleData.filter((vehicle) => vehicle.status === 'Maintenance').length,
      status: 'Service pending',
      icon: FiTool,
      accent: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Fleet Operations</p>
        <h1 className="mt-2 text-3xl font-semibold">Vehicles</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">Manage and monitor the complete fleet with a premium operations view.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <VehicleSummaryCard key={card.title} {...card} />
        ))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusOptions={vehicleStatuses}
        typeOptions={vehicleTypes}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Fleet Inventory</h2>
            <p className="text-sm text-slate-500">{filteredVehicles.length} vehicles visible</p>
          </div>
        </div>

        <VehicleTable vehicles={filteredVehicles} />
      </div>
    </div>
  );
};

export default VehiclesPage;
