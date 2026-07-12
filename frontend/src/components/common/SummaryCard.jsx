import React from 'react';

const SummaryCard = ({ title, value, status, icon: Icon, accent = 'from-sky-500 to-blue-600' }) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        {Icon ? (
          <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm text-slate-500">{status}</span>
        <span className="text-sm font-semibold text-slate-700">Live</span>
      </div>
    </div>
  );
};

export default SummaryCard;
