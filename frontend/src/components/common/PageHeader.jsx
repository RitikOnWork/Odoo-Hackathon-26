const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-300">TransitOps</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-300">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
