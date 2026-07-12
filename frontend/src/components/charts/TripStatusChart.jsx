import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { tripStatusData } from '../../constants/chartData';

const TripStatusChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={tripStatusData} barSize={44}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {tripStatusData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TripStatusChart;
