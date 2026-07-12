import { Search, LogOut, UserCircle2 } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-6 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:max-w-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <Search size={16} />
          <input type="text" placeholder="Search operations" className="w-full border-0 bg-transparent outline-none" />
        </label>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationDropdown />
          <ThemeToggle />
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800">
            <UserCircle2 size={20} className="text-slate-600 dark:text-slate-300" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Operations Lead</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
            </div>
          </div>
          <button type="button" className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
