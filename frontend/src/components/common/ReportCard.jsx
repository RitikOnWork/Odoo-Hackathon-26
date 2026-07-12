import { FiFileText, FiDownload } from 'react-icons/fi';

const ReportCard = ({ title, description, metrics }) => {
  return (
    <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
          <FiFileText />
        </div>
        <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
          <FiDownload />
        </button>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric} className="rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600">
            {metric}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Generate Report
        </button>
        <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Export
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
