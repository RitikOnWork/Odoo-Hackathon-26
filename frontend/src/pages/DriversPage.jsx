import { useMemo, useState } from 'react';
import { FiUsers, FiClock, FiShield, FiBriefcase } from 'react-icons/fi';
import SearchFilterBar from '../components/common/SearchFilterBar';
import SummaryCard from '../components/common/SummaryCard';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ActionButtons from '../components/common/ActionButtons';
import DriverProfileModal from '../components/drivers/DriverProfileModal';
import { driverData, driverStatuses, licenseTypes } from '../constants/drivers';

const DriversPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [licenseFilter, setLicenseFilter] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);

  const filteredDrivers = useMemo(() => {
    return driverData.filter((driver) => {
      const matchesSearch = `${driver.name} ${driver.id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
      const matchesLicense = licenseFilter === 'All' || driver.licenseType === licenseFilter;
      return matchesSearch && matchesStatus && matchesLicense;
    });
  }, [searchTerm, statusFilter, licenseFilter]);

  const summaryCards = [
    { title: 'Total Drivers', value: driverData.length, status: 'Fleet roster', icon: FiUsers, accent: 'from-slate-700 to-slate-900' },
    { title: 'Drivers On Duty', value: driverData.filter((driver) => driver.status === 'On Duty').length, status: 'Operational now', icon: FiClock, accent: 'from-emerald-500 to-green-600' },
    { title: 'Drivers Off Duty', value: driverData.filter((driver) => driver.status === 'Off Duty').length, status: 'Available for assignment', icon: FiShield, accent: 'from-sky-500 to-blue-600' },
    { title: 'Drivers on Leave', value: driverData.filter((driver) => driver.status === 'Leave').length, status: 'Scheduled leave', icon: FiBriefcase, accent: 'from-amber-500 to-orange-500' },
  ];

  const columns = ['Driver Name', 'Driver ID', 'Assigned Vehicle', 'License Type', 'Experience', 'Contact', 'Status', 'Actions'];

  const renderRow = (driver) => (
    <tr key={driver.id} className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{driver.name}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{driver.id}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{driver.vehicle}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{driver.licenseType}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{driver.experience}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{driver.contact}</td>
      <td className="px-4 py-4"><StatusBadge status={driver.status} /></td>
      <td className="px-4 py-4">
        <ActionButtons onView={() => setSelectedDriver(driver)} onEdit={() => setSelectedDriver(driver)} onDelete={() => setSelectedDriver(driver)} />
      </td>
    </tr>
  );

  const renderMobileCard = (driver) => (
    <div key={driver.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{driver.name}</p>
          <p className="mt-1 text-sm text-slate-500">{driver.id}</p>
        </div>
        <StatusBadge status={driver.status} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Vehicle</span><span className="font-medium text-slate-900">{driver.vehicle}</span></div>
        <div className="flex items-center justify-between"><span>License</span><span>{driver.licenseType}</span></div>
        <div className="flex items-center justify-between"><span>Experience</span><span>{driver.experience}</span></div>
        <div className="flex items-center justify-between"><span>Contact</span><span>{driver.contact}</span></div>
      </div>
      <div className="mt-4"><ActionButtons onView={() => setSelectedDriver(driver)} onEdit={() => setSelectedDriver(driver)} onDelete={() => setSelectedDriver(driver)} /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">People Operations</p>
        <h1 className="mt-2 text-3xl font-semibold">Drivers</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">Manage and monitor the complete driving roster with a premium operations overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[
          { label: 'Status', value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), options: driverStatuses, placeholder: 'All Status' },
          { label: 'License', value: licenseFilter, onChange: (event) => setLicenseFilter(event.target.value), options: licenseTypes, placeholder: 'All Licenses' },
        ]}
        buttonLabel="Add Driver"
        onAddClick={() => setSelectedDriver(null)}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Driver Directory</h2>
            <p className="text-sm text-slate-500">{filteredDrivers.length} drivers visible</p>
          </div>
        </div>
        <DataTable columns={columns} rows={filteredDrivers} renderRow={renderRow} renderMobileCard={renderMobileCard} />
      </div>

      <DriverProfileModal driver={selectedDriver} isOpen={Boolean(selectedDriver)} onClose={() => setSelectedDriver(null)} />
    </div>
  );
};

export default DriversPage;
