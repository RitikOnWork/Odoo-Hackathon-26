import {
  FiTruck,
  FiTool,
  FiMapPin,
  FiClock,
  FiUsers,
  FiDroplet,
  FiTrendingUp,
} from 'react-icons/fi';
import KpiCard from '../components/dashboard/KpiCard';

const kpis = [
  {
    title: 'Active Vehicles',
    value: '128',
    status: '+6% from last week',
    icon: FiTruck,
    accent: 'from-cyan-500 to-sky-600',
  },
  {
    title: 'Available Vehicles',
    value: '94',
    status: 'Ready for dispatch',
    icon: FiMapPin,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Vehicles in Maintenance',
    value: '12',
    status: '3 critical checks',
    icon: FiTool,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Active Trips',
    value: '47',
    status: 'On-time performance',
    icon: FiClock,
    accent: 'from-violet-500 to-fuchsia-600',
  },
  {
    title: 'Pending Trips',
    value: '18',
    status: 'Awaiting confirmation',
    icon: FiTrendingUp,
    accent: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Drivers On Duty',
    value: '39',
    status: '2 shifts ending soon',
    icon: FiUsers,
    accent: 'from-indigo-500 to-blue-700',
  },
  {
    title: 'Fleet Utilization (%)',
    value: '82%',
    status: 'Peak efficiency',
    icon: FiDroplet,
    accent: 'from-slate-700 to-slate-900',
  },
];

const analyticsCards = [
  { title: 'Vehicle Status' },
  { title: 'Trip Status' },
  { title: 'Fuel Consumption' },
  { title: 'Operational Cost' },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">TransitOps</p>
        <h1 className="mt-2 text-3xl font-semibold">Smart Transport Operations Platform</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Monitor fleet health, dispatch activity, and daily operations from a single premium command center.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {analyticsCards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
            <div className="mt-8 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              Chart will be added here
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
