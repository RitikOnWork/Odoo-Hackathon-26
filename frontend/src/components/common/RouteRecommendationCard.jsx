const RouteRecommendationCard = ({ recommendation }) => {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sky-600">AI Recommendation</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{recommendation.recommendedRoute}</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Optimized</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Travel Time</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{recommendation.travelTime}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Distance</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{recommendation.distance}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Fuel Saved</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{recommendation.fuelSaved}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Traffic Avoided</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{recommendation.trafficAvoided}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <span>Estimated arrival: {recommendation.estimatedArrival}</span>
        <span>Alternative: {recommendation.alternativeRoute}</span>
      </div>
    </div>
  );
};

export default RouteRecommendationCard;
