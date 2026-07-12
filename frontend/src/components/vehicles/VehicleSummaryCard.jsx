import KpiCard from '../dashboard/KpiCard';

const VehicleSummaryCard = ({ title, value, status, icon: Icon, accent = 'from-sky-500 to-blue-600' }) => {
  return <KpiCard title={title} value={value} status={status} icon={Icon} accent={accent} />;
};

export default VehicleSummaryCard;
