import { useMemo, useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTool, FiShield } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/common/SummaryCard';
import SearchFilterBar from '../components/common/SearchFilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import ActionButtons from '../components/common/ActionButtons';
import Modal from '../components/common/Modal';
import { expenseData, expenseCategories } from '../data/expenses';

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const filteredExpenses = useMemo(() => {
    return expenseData.filter((expense) => {
      const matchesSearch = `${expense.category} ${expense.vehicleId} ${expense.description}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const summaryCards = [
    { title: 'Total Expenses', value: '₹4.8L', status: 'Across operations', icon: FiDollarSign, accent: 'from-slate-700 to-slate-900' },
    { title: 'Fuel Expenses', value: '₹1.2L', status: 'Refueling costs', icon: FiTrendingUp, accent: 'from-sky-500 to-blue-600' },
    { title: 'Maintenance Expenses', value: '₹82K', status: 'Fleet service spend', icon: FiTool, accent: 'from-emerald-500 to-green-600' },
    { title: 'Other Operational Costs', value: '₹1.5L', status: 'Insurance and misc.', icon: FiShield, accent: 'from-amber-500 to-orange-500' },
  ];

  const columns = ['Expense ID', 'Category', 'Vehicle ID', 'Description', 'Amount', 'Date', 'Payment Status', 'Actions'];

  const renderRow = (expense) => (
    <tr key={expense.id} className="transition hover:bg-slate-50">
      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{expense.id}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{expense.category}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{expense.vehicleId}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{expense.description}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{expense.amount}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{expense.date}</td>
      <td className="px-4 py-4"><StatusBadge status={expense.paymentStatus} /></td>
      <td className="px-4 py-4"><ActionButtons onView={() => setSelectedExpense(expense)} onEdit={() => setSelectedExpense(expense)} onDelete={() => setSelectedExpense(expense)} /></td>
    </tr>
  );

  const renderMobileCard = (expense) => (
    <div key={expense.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{expense.id}</p>
          <p className="mt-1 text-sm text-slate-500">{expense.vehicleId}</p>
        </div>
        <StatusBadge status={expense.paymentStatus} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Category</span><span>{expense.category}</span></div>
        <div className="flex items-center justify-between"><span>Amount</span><span>{expense.amount}</span></div>
        <div className="flex items-center justify-between"><span>Date</span><span>{expense.date}</span></div>
      </div>
      <div className="mt-4"><ActionButtons onView={() => setSelectedExpense(expense)} onEdit={() => setSelectedExpense(expense)} onDelete={() => setSelectedExpense(expense)} /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" subtitle="Monitor operational expenses and financial performance" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (<SummaryCard key={card.title} {...card} />))}
      </div>

      <div className="flex flex-wrap gap-3">
        {expenseCategories.map((category) => (
          <button key={category} type="button" onClick={() => setCategoryFilter(category)} className={`rounded-full px-3 py-2 text-sm font-medium transition ${categoryFilter === category ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {category}
          </button>
        ))}
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={[]}
        buttonLabel="Add Expense"
        onAddClick={() => setSelectedExpense(null)}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Expense Ledger</h2>
            <p className="text-sm text-slate-500">{filteredExpenses.length} expenses visible</p>
          </div>
        </div>
        <DataTable columns={columns} rows={filteredExpenses} renderRow={renderRow} renderMobileCard={renderMobileCard} />
      </div>

      <Modal isOpen={Boolean(selectedExpense)} title="Expense Details" onClose={() => setSelectedExpense(null)}>
        {selectedExpense ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.category}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Vehicle</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.vehicleId}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Description</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Amount</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.amount}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Date</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.date}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Payment Status</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedExpense.paymentStatus}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ExpensesPage;
