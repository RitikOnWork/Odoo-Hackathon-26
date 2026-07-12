const MapCard = ({ title, subtitle, controls, children }) => {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {controls ? <div className="flex flex-wrap gap-2">{controls}</div> : null}
      </div>
      {children}
    </div>
  );
};

export default MapCard;
