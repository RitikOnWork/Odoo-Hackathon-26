import { useMemo, useState } from 'react';
import { FiMap, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import SearchFilterBar from '../components/common/SearchFilterBar';
import SummaryCard from '../components/common/SummaryCard';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ActionButtons from '../components/common/ActionButtons';
import { tripData, tripStatuses, tripRegions } from '../constants/trips';

const TripsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  const filteredTrips = useMemo(() => {
    return tripData.filter((trip) => {
      const matchesSearch = `${trip.id} ${trip.vehicle} ${trip.driver}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
      const matchesRegion = regionFilter === 'All' || trip.source.includes(regionFilter) || trip.destination.includes(regionFilter);
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [searchTerm, statusFilter, regionFilter]);

  const summaryCards = [
    { title: 'Total Trips', value: tripData.length, status: 'All trip activity', icon: FiMap, accent: 'from-slate-700 to-slate-900' },
    { title: 'Active Trips', value: tripData.filter((trip) => trip.status === 'Active').length, status: 'In motion', icon: FiTrendingUp, accent: 'from-emerald-500 to-green-600' },
    { title: 'Completed Trips', value: tripData.filter((trip) => trip.status === 'Completed').length, status: 'Successfully closed', icon: FiCheckCircle, accent: 'from-sky-500 to-blue-600' },
    { title: 'Pending Trips', value: tripData.filter((trip) => trip.status === 'Pending').length, status: 'Awaiting dispatch', icon: FiClock, accent: 'from-amber-500 to-orange-500' },
  ];

  const columns = ['Trip ID', 'Vehicle', 'Driver', 'Source', 'Destination', 'Distance', 'Status', 'Start Time', 'Actions'];

  const renderRow = (trip) => (
    <tr key={trip.id} className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{trip.id}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.vehicle}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.driver}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.source}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.destination}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.distance}</td>
      <td className="px-4 py-4"><StatusBadge status={trip.status} /></td>
      <td className="px-4 py-4 text-sm text-slate-600">{trip.startTime}</td>
      <td className="px-4 py-4"><ActionButtons /></td>
    </tr>
  );

  const renderMobileCard = (trip) => (
    <div key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{trip.id}</p>
          <p className="mt-1 text-sm text-slate-500">{trip.vehicle} • {trip.driver}</p>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Route</span><span className="font-medium text-slate-900">{trip.source} → {trip.destination}</span></div>
        <div className="flex items-center justify-between"><span>Distance</span><span>{trip.distance}</span></div>
        <div className="flex items-center justify-between"><span>Start Time</span><span>{trip.startTime}</span></div>
      </div>
      <div className="mt-4"><ActionButtons /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Dispatch Operations</p>
        <h1 className="mt-2 text-3xl font-semibold">Trips</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">Track trip activity across regions and keep every dispatch on schedule.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          { label: 'Status', value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), options: tripStatuses, placeholder: 'All Status' },
          { label: 'Region', value: regionFilter, onChange: (event) => setRegionFilter(event.target.value), options: tripRegions, placeholder: 'All Regions' },
        ]}
        buttonLabel="Add Trip"
        onAddClick={() => {}}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Trip Timeline</h2>
            <p className="text-sm text-slate-500">{filteredTrips.length} trips visible</p>
          </div>
        </div>
        <DataTable columns={columns} rows={filteredTrips} renderRow={renderRow} renderMobileCard={renderMobileCard} />
      </div>
    </div>
  );
};

export default TripsPage;
