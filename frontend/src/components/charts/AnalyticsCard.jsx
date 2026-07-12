const AnalyticsCard = ({ title, subtitle, children }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className="h-72 w-full">{children}</div>
    </article>
  );
};

export default AnalyticsCard;
