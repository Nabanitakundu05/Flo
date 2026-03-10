import { useState, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { TransactionRow } from '../components/TransactionRow';
import { TransactionModal } from '../components/TransactionModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Toast } from '../components/Toast';
import { StatCardSkeleton } from '../components/skeletons/StatCardSkeleton';
import { TransactionRowSkeleton } from '../components/skeletons/TransactionRowSkeleton';
import { SpendingDonut } from '../components/charts/SpendingDonut';
import { MonthlyBars } from '../components/charts/MonthlyBars';
import { ChartSkeleton } from '../components/skeletons/ChartSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { profile } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const {
    transactions,
    loading,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(month, year);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    const nextM = month === 12 ? 1 : month + 1;
    const nextY = month === 12 ? year + 1 : year;
    if (nextY > now.getFullYear() || (nextY === now.getFullYear() && nextM > now.getMonth() + 1)) return;
    setMonth(nextM);
    setYear(nextY);
  }

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  function openAdd() {
    setEditingTx(null);
    setModalOpen(true);
  }

  function openEdit(tx) {
    setEditingTx(tx);
    setModalOpen(true);
  }

  async function handleSave(formData) {
    if (editingTx) {
      await updateTransaction(editingTx.id, formData, addToast);
    } else {
      await addTransaction(formData, addToast);
    }
  }

  async function handleDelete(id) {
    await deleteTransaction(id, addToast);
  }

  const filtered = useMemo(() => {
    let list = transactions;
    if (filter !== 'all') list = list.filter((t) => t.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.category.includes(q));
    }
    return list;
  }, [transactions, filter, search]);

  return (
    <div className="min-h-screen bg-bg-base page-enter">
      <Navbar />
      <Toast toasts={toasts} onRemove={removeToast} />

      <ErrorBoundary>
        <main className="max-w-6xl mx-auto px-6 pb-24">
          {/* Hero row */}
          <div className="pt-10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle">
            <div>
              <p className="font-dm-sans text-warm-500 text-sm mb-1">{getGreeting()},</p>
              <h1 className="font-syne text-3xl font-bold text-warm-100">{firstName}.</h1>
            </div>
            {/* Month selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-xl border border-border-subtle flex items-center justify-center text-warm-400 hover:text-warm-200 hover:border-border-muted transition-colors duration-150 btn-press"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <span className="font-syne font-semibold text-warm-100 text-sm w-32 text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                onClick={nextMonth}
                disabled={isCurrentMonth}
                className="w-8 h-8 rounded-xl border border-border-subtle flex items-center justify-center text-warm-400 hover:text-warm-200 hover:border-border-muted transition-colors duration-150 btn-press disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard icon={Wallet} label="Balance" value={balance} type={balance >= 0 ? 'income' : 'expense'} trend={0} trendLabel={undefined} />
                <StatCard icon={TrendingUp} label="Income" value={totalIncome} type="income" trend={0} trendLabel={undefined} />
                <StatCard icon={TrendingDown} label="Expenses" value={totalExpense} type="expense" trend={0} trendLabel={undefined} />
                <StatCard icon={Percent} label="Savings Rate" value={savingsRate} type="savings" trend={0} trendLabel={undefined} isPercent />
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {loading ? (
              <>
                <ChartSkeleton height={220} />
                <ChartSkeleton height={220} />
              </>
            ) : (
              <>
                <SpendingDonut transactions={transactions} />
                <MonthlyBars />
              </>
            )}
          </div>

          {/* Transactions */}
          <div className="mt-8">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-syne text-lg font-semibold text-warm-100">Transactions</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative group">
                  <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-8 py-2 text-sm font-dm-sans bg-bg-surface border border-border-subtle rounded-xl text-warm-200 placeholder:text-warm-600 outline-none focus:border-accent-indigo transition-colors duration-200 w-32 focus:w-48 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-500 hover:text-warm-300">
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
                {/* Filter tabs */}
                <div className="flex gap-1 p-0.5 bg-bg-surface border border-border-subtle rounded-xl">
                  {['all', 'income', 'expense'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 text-xs font-dm-sans rounded-lg capitalize transition-all duration-150 btn-press ${
                        filter === f
                          ? 'bg-bg-elevated text-warm-100 border border-border-subtle'
                          : 'text-warm-500 hover:text-warm-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction list */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
              {loading ? (
                <TransactionRowSkeleton />
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
                    <Wallet size={20} strokeWidth={1.5} className="text-warm-500" />
                  </div>
                  <p className="font-syne font-semibold text-warm-300 text-base">No transactions yet</p>
                  <p className="font-dm-sans text-warm-500 text-sm mt-1">Add your first one using the + button.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {filtered.map((tx, i) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      index={i}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </ErrorBoundary>

      <FloatingActionButton onClick={openAdd} />
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingTx={editingTx}
      />
    </div>
  );
}
