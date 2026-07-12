import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fuelConsumptionData } from '../../constants/chartData';

const FuelConsumptionChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={fuelConsumptionData}>
        <defs>
          <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0f766e" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="liters" stroke="#0f766e" strokeWidth={2.5} fill="url(#fuelGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default FuelConsumptionChart;
