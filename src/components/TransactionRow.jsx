import { useState } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { CATEGORIES } from './TransactionModal';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function TransactionRow({ tx, onEdit, onDelete, index }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cat = CATEGORIES.find((c) => c.value === tx.category) || CATEGORIES[CATEGORIES.length - 1];
  const isIncome = tx.type === 'income';

  async function handleDelete() {
    setDeleting(true);
    await onDelete(tx.id);
  }

  return (
    <div
      className={`group flex items-center gap-4 px-5 py-3.5 hover:bg-bg-hover transition-colors duration-150 ${
        deleting ? 'tx-row-deleting' : 'tx-row-enter'
      }`}
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Category icon circle */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{ backgroundColor: cat.bg, color: cat.color }}
      >
        {cat.icon}
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-dm-sans text-warm-100 truncate">{tx.name}</p>
        <p className="text-xs text-warm-400 font-dm-sans mt-0.5">{cat.label}</p>
      </div>

      {/* Date */}
      <p className="text-xs text-warm-400 font-dm-sans flex-shrink-0 hidden sm:block">
        {formatDate(tx.date)}
      </p>

      {/* Amount */}
      <div className="flex-shrink-0 text-right min-w-[96px]">
        <span className={`font-dm-mono text-sm font-medium ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}₹{formatINR(tx.amount)}
        </span>
      </div>

      {/* Actions */}
      {!confirmDelete ? (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <button
            onClick={() => onEdit(tx)}
            className="p-1.5 rounded-lg hover:bg-bg-elevated text-warm-400 hover:text-warm-100 transition-colors duration-150"
            aria-label="Edit transaction"
          >
            <Pencil size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg hover:bg-bg-elevated text-warm-400 hover:text-expense transition-colors duration-150"
            aria-label="Delete transaction"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0 animate-fade-up">
          <span className="text-xs text-warm-300 font-dm-sans">Sure?</span>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-expense hover:text-expense-muted font-dm-sans transition-colors duration-150"
          >
            <CheckCircle size={13} strokeWidth={1.5} />
            Yes
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="flex items-center gap-1 text-xs text-warm-400 hover:text-warm-200 font-dm-sans transition-colors duration-150"
          >
            <XCircle size={13} strokeWidth={1.5} />
            No
          </button>
        </div>
      )}
    </div>
  );
}
