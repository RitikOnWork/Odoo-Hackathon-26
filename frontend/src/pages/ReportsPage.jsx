import { useMemo, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import ReportCard from '../components/common/ReportCard';
import ChartCard from '../components/common/ChartCard';
import { reportCards, monthlyExpenseData, costDistributionData, fuelVsMaintenanceData } from '../data/reports';
import { FiBarChart2, FiPieChart, FiDownload, FiFileText } from 'react-icons/fi';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(reportCards[0]);
  const summaryCards = [
    { title: 'Fleet Utilization', value: '82%', status: 'Live operations', icon: FiBarChart2, accent: 'from-slate-700 to-slate-900' },
    { title: 'Fuel Efficiency', value: '6.8 km/L', status: 'Current month', icon: FiPieChart, accent: 'from-sky-500 to-blue-600' },
    { title: 'Open Maintenance', value: '6 items', status: 'Upcoming actions', icon: FiFileText, accent: 'from-emerald-500 to-green-600' },
    { title: 'Reports Ready', value: '5', status: 'Export ready', icon: FiDownload, accent: 'from-amber-500 to-orange-500' },
  ];

  const renderChartCards = () => (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartCard title="Monthly Expense Trend" subtitle="Operational spend over time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyExpenseData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Cost Distribution" subtitle="Share of expenditure">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={costDistributionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {costDistributionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Fuel vs Maintenance Cost" subtitle="Operational cost comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fuelVsMaintenanceData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="fuel" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="maintenance" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Insights" subtitle="Generate operational reports and analyze fleet performance" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Download PDF</button>
        <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Export CSV</button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {reportCards.map((report) => (
              <div key={report.title} onClick={() => setSelectedReport(report)} className="cursor-pointer">
                <ReportCard {...report} />
              </div>
            ))}
          </div>
          {renderChartCards()}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Selected Report</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedReport?.title}</p>
            </div>
            <div className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Focused
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {selectedReport?.description}
          </div>

          <div className="mt-5 space-y-2">
            {selectedReport?.metrics.map((metric) => (
              <div key={metric} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm">{metric}</div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
            Export this report or generate a fresh insight pack to share with your operations team.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReportsPage;
