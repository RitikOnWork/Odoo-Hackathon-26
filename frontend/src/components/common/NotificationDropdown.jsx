import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { notifications } from '../../data/notifications';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColors = {
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    danger: 'bg-rose-500',
    success: 'bg-emerald-500',
  };

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <Bell size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-80 rounded-[24px] border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-2 flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{notifications.length} new</span>
          </div>

          <div className="space-y-2">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${statusColors[item.status]}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.title}</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{item.priority}</span>
                      <span className="rounded-full bg-white px-2 py-1 dark:bg-slate-700">{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationDropdown;
