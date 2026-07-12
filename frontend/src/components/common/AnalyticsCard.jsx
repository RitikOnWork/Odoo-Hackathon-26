const AnalyticsCard = ({ title, value, detail, tone = 'sky' }) => {
  const toneClasses = {
    sky: 'border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-300',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300',
    amber: 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300',
  };

  return (
    <div className={`rounded-[20px] border p-4 ${toneClasses[tone]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {detail ? <p className="mt-1 text-sm opacity-80">{detail}</p> : null}
    </div>
  );
};

export default AnalyticsCard;
