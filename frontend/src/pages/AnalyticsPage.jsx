import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import ChartCard from '../components/common/ChartCard';
import { analyticsCards, fuelTrend, utilizationData, monthlyTrips, maintenanceCostTrend, driverPerformance } from '../data/analytics';

const COLORS = ['#0ea5e9', '#34d399', '#f59e0b'];

const AnalyticsPage = () => {
  const [range, setRange] = useState('Last 6 months');

  const hasData = useMemo(() => {
    return Boolean(fuelTrend?.length && utilizationData?.length && monthlyTrips?.length && maintenanceCostTrend?.length && driverPerformance?.length);
  }, []);

  return (
    <div>
      <PageHeader title="Transport Analytics" subtitle="Track performance and fleet efficiency across your network." action={<div className="flex items-center gap-2"><select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><option>Last 6 months</option><option>Last 12 months</option></select><button type="button" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><Download size={16} /> Export</button></div>} />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsCards.map((item) => (
          <SummaryCard key={item.title} title={item.title} value={item.value} detail={item.detail} tone={item.tone} />
        ))}
      </div>

      {!hasData ? (
        <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
          Analytics data is currently unavailable. The dashboard will render once the data feed is available.
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Fuel Consumption Trend" subtitle="Average fuel usage by month">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={fuelTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="consumption" stroke="#0ea5e9" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vehicle Utilization" subtitle="Fleet availability by operating category">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={utilizationData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={5}>
                    {utilizationData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <ChartCard title="Monthly Trips" subtitle="Trips completed over time">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyTrips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Maintenance Cost Trend" subtitle="Cost trend across the last six months">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={maintenanceCostTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="cost" stroke="#10b981" fill="#34d399" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="mt-4">
            <ChartCard title="Driver Performance" subtitle="Skill coverage and reliability index">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={driverPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
