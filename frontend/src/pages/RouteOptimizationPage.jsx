import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import RouteRecommendationCard from '../components/common/RouteRecommendationCard';
import { routeOptimizationData } from '../data/routeOptimization';

const RouteOptimizationPage = () => {
  const [formData, setFormData] = useState({
    source: routeOptimizationData.source,
    destination: routeOptimizationData.destination,
    vehicle: routeOptimizationData.vehicle,
    priority: routeOptimizationData.priority,
  });

  return (
    <div>
      <PageHeader title="AI Route Optimization" subtitle="Optimize transport routes using intelligent recommendations." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Optimization Form</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate route recommendations powered by AI planning logic.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Source</label>
              <input value={formData.source} onChange={(event) => setFormData((current) => ({ ...current, source: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Destination</label>
              <input value={formData.destination} onChange={(event) => setFormData((current) => ({ ...current, destination: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle</label>
                <select value={formData.vehicle} onChange={(event) => setFormData((current) => ({ ...current, vehicle: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800">
                  <option>BUS-102</option>
                  <option>BUS-204</option>
                  <option>BUS-318</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <select value={formData.priority} onChange={(event) => setFormData((current) => ({ ...current, priority: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <button type="button" className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200">Optimize Route</button>
          </div>
        </div>

        <div className="space-y-5">
          <RouteRecommendationCard recommendation={routeOptimizationData} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Route</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{routeOptimizationData.currentTime}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fuel usage: {routeOptimizationData.currentFuel}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Traffic impact: {routeOptimizationData.currentTraffic}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Optimized Route</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{routeOptimizationData.timeSaved}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fuel saved: {routeOptimizationData.fuelSavedComparison}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Traffic reduction: {routeOptimizationData.trafficReduction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizationPage;
