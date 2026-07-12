import { useMemo, useState } from 'react';
import { FiTool, FiCalendar, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import SearchFilterBar from '../components/common/SearchFilterBar';
import SummaryCard from '../components/common/SummaryCard';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ActionButtons from '../components/common/ActionButtons';
import { maintenanceData, maintenanceStatuses, maintenanceTypes } from '../constants/maintenance';

const MaintenancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredMaintenance = useMemo(() => {
    return maintenanceData.filter((item) => {
      const matchesSearch = `${item.vehicle} ${item.serviceType} ${item.technician}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || item.serviceType === typeFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const summaryCards = [
    { title: 'Vehicles Under Maintenance', value: maintenanceData.filter((item) => item.status !== 'Completed').length, status: 'Active service queue', icon: FiTool, accent: 'from-slate-700 to-slate-900' },
    { title: 'Upcoming Services', value: maintenanceData.filter((item) => item.status === 'Scheduled').length, status: 'Planned this week', icon: FiCalendar, accent: 'from-sky-500 to-blue-600' },
    { title: 'Completed Services', value: maintenanceData.filter((item) => item.status === 'Completed').length, status: 'Closed successfully', icon: FiCheckCircle, accent: 'from-emerald-500 to-green-600' },
    { title: 'Total Maintenance Cost', value: '$2,930', status: 'Estimated spend', icon: FiDollarSign, accent: 'from-amber-500 to-orange-500' },
  ];

  const columns = ['Vehicle', 'Service Type', 'Scheduled Date', 'Technician', 'Estimated Cost', 'Status', 'Actions'];

  const renderRow = (item) => (
    <tr key={item.id} className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{item.vehicle}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{item.serviceType}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{item.scheduledDate}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{item.technician}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{item.estimatedCost}</td>
      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
      <td className="px-4 py-4"><ActionButtons /></td>
    </tr>
  );

  const renderMobileCard = (item) => (
    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.vehicle}</p>
          <p className="mt-1 text-sm text-slate-500">{item.serviceType}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Scheduled</span><span>{item.scheduledDate}</span></div>
        <div className="flex items-center justify-between"><span>Technician</span><span>{item.technician}</span></div>
        <div className="flex items-center justify-between"><span>Cost</span><span>{item.estimatedCost}</span></div>
      </div>
      <div className="mt-4"><ActionButtons /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Fleet Reliability</p>
        <h1 className="mt-2 text-3xl font-semibold">Maintenance</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">Coordinate repairs, inspections, and preventive service with a clear operational view.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          { label: 'Type', value: typeFilter, onChange: (event) => setTypeFilter(event.target.value), options: maintenanceTypes, placeholder: 'All Types' },
          { label: 'Status', value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), options: maintenanceStatuses, placeholder: 'All Status' },
        ]}
        buttonLabel="Schedule Maintenance"
        onAddClick={() => {}}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Service Schedule</h2>
            <p className="text-sm text-slate-500">{filteredMaintenance.length} maintenance items visible</p>
          </div>
        </div>
        <DataTable columns={columns} rows={filteredMaintenance} renderRow={renderRow} renderMobileCard={renderMobileCard} />
      </div>
    </div>
  );
};

export default MaintenancePage;
