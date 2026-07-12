import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';

const SettingsPage = () => {
  const [themePreference, setThemePreference] = useState('System');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your workspace preferences and account defaults." />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <section className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="Operations Lead" /></div>
              <div><label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="ops@transitops.com" /></div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Organization</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="Northstar Transit" /></div>
              <div><label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Region</label><input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="Bengaluru" /></div>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
              <select value={themePreference} onChange={(event) => setThemePreference(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <label className="flex items-center justify-between"><span>Trip alerts</span><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" /></label>
              <label className="flex items-center justify-between"><span>Maintenance reminders</span><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" /></label>
              <label className="flex items-center justify-between"><span>Fuel threshold alerts</span><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" /></label>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white">Save Changes</button>
        <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Reset Settings</button>
      </div>
    </div>
  );
}

export default SettingsPage;
