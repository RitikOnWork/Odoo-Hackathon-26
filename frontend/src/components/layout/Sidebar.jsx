import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';
import { LayoutGrid, Menu, X, Bus, Users, Route, Wrench, Fuel, BadgeDollarSign, BarChart3, Settings, ChevronRight, LogOut, Radar, Compass } from 'lucide-react';

const iconMap = {
  Dashboard: LayoutGrid,
  Vehicles: Bus,
  Drivers: Users,
  Trips: Route,
  Maintenance: Wrench,
  'Fuel Logs': Fuel,
  Expenses: BadgeDollarSign,
  Reports: BarChart3,
  Analytics: BarChart3,
  'Live Fleet': Bus,
  'Route AI': Compass,
  Settings: Settings,
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-full border border-slate-200 bg-white p-2 shadow-md lg:hidden"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 -translate-x-full border-r border-slate-200 bg-slate-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : ''}`}>
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">TransitOps</h4>
              <p className="text-sm text-slate-400">Transport Operations</p>
            </div>
            <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = iconMap[item.label] || LayoutGrid;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-all duration-200 ${isActive ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  <ChevronRight size={16} className="opacity-70" />
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
              <p className="font-semibold text-white">Operations command center</p>
              <p className="mt-1 text-xs text-slate-400">Live fleet visibility and performance intelligence.</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
