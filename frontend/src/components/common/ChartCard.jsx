const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Live
        </div>
      </div>
      <div className="h-72 rounded-2xl bg-slate-50/80 p-3">{children}</div>
    </div>
  );
};

export default ChartCard;
