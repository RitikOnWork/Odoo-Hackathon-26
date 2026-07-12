import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { vehicleStatusData } from '../../constants/chartData';

const VehicleStatusChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={vehicleStatusData}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
        >
          {vehicleStatusData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VehicleStatusChart;
