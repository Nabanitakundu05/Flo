import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Utensils, Car, ShoppingBag, Film, Pill, Zap, Briefcase, TrendingUp, Package } from 'lucide-react';

export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: <Utensils size={16} />, color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  { value: 'transport', label: 'Transport', icon: <Car size={16} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  { value: 'shopping', label: 'Shopping', icon: <ShoppingBag size={16} />, color: '#c084fc', bg: 'rgba(192,132,252,0.15)' },
  { value: 'entertainment', label: 'Entertainment', icon: <Film size={16} />, color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
  { value: 'health', label: 'Health', icon: <Pill size={16} />, color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  { value: 'utilities', label: 'Utilities', icon: <Zap size={16} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  { value: 'salary', label: 'Salary', icon: <Briefcase size={16} />, color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  { value: 'investment', label: 'Investment', icon: <TrendingUp size={16} />, color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  { value: 'other', label: 'Other', icon: <Package size={16} />, color: '#a3a3a3', bg: 'rgba(163,163,163,0.15)' },
];

const EMPTY = {
  name: '',
  amount: '',
  type: 'expense',
  category: 'food',
  date: new Date().toISOString().slice(0, 10),
};

function FloatInput({ id, label, type = 'text', value, onChange, min, step, required }) {
  const hasValue = value !== '' && value !== undefined;
  return (
    <div className={`float-label-group ${hasValue ? 'has-value' : ''}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        min={min}
        step={step}
        required={required}
        autoComplete="off"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function CustomCategorySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCat = CATEGORIES.find((c) => c.value === value) || CATEGORIES[0];

  return (
    <div className="float-label-group has-value relative" ref={ref}>
      <div 
        className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 pt-6 pb-2 text-warm-100 font-dm-sans text-sm outline-none transition-colors duration-200 focus-within:border-accent-indigo cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: selectedCat.color }} className="flex items-center justify-center">{selectedCat.icon}</span>
          <span>{selectedCat.label}</span>
        </div>
        <ChevronDown size={16} className={`text-warm-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <label className="absolute left-4 top-4 text-xs text-warm-400 scale-90 origin-left pointer-events-none">
        Category
      </label>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg z-[60] max-h-60 overflow-y-auto py-1">
          {CATEGORIES.map((c) => (
            <div
              key={c.value}
              className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-bg-hover transition-colors ${value === c.value ? 'bg-bg-hover' : ''}`}
              onClick={() => {
                onChange(c.value);
                setIsOpen(false);
              }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: c.bg, color: c.color }}
              >
                {c.icon}
              </div>
              <span className="text-sm font-dm-sans text-warm-100">{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TransactionModal({ isOpen, onClose, onSave, editingTx }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(editingTx ? {
        name: editingTx.name,
        amount: String(editingTx.amount),
        type: editingTx.type,
        category: editingTx.category,
        date: editingTx.date,
      } : EMPTY);
    }
  }, [isOpen, editingTx]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function set(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    await onSave({
      name: form.name.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    });
    setSaving(false);
    onClose();
  }

  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 200ms ease-out forwards',
      }}
    >
      <div className="modal-enter w-full max-w-[480px] bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <h2 className="font-syne text-lg font-semibold text-warm-100">
            {editingTx ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-hover text-warm-400 hover:text-warm-200 transition-colors duration-150"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <FloatInput
            id="tx-name"
            label="Transaction name"
            value={form.name}
            onChange={set('name')}
            required
          />

          <FloatInput
            id="tx-amount"
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={set('amount')}
            min="0.01"
            step="0.01"
            required
          />

          {/* Type toggle */}
          <div>
            <p className="text-xs text-warm-400 font-dm-sans mb-2 uppercase tracking-widest">Type</p>
            <div className="flex gap-2 p-1 bg-bg-elevated rounded-xl border border-border-subtle">
              {['income', 'expense'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-dm-sans font-medium transition-all duration-200 btn-press ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-income/20 text-income border border-income/30'
                        : 'bg-expense/20 text-expense border border-expense/30'
                      : 'text-warm-400 hover:text-warm-200'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <CustomCategorySelect 
            value={form.category} 
            onChange={(val) => setForm(p => ({ ...p, category: val }))} 
          />

          {/* Date */}
          <div className="float-label-group has-value">
            <input
              id="tx-date"
              type="date"
              value={form.date}
              onChange={set('date')}
              className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 pt-6 pb-2 text-warm-100 font-dm-sans text-sm outline-none transition-colors duration-200 focus:border-accent-indigo"
            />
            <label htmlFor="tx-date" className="absolute left-4 top-4 text-xs text-warm-400 scale-90 origin-left pointer-events-none">
              Date
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-subtle text-warm-300 text-sm font-dm-sans hover:border-border-muted hover:text-warm-100 transition-colors duration-150 btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-indigo-dim text-white text-sm font-dm-sans font-medium transition-colors duration-150 btn-press disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : editingTx ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
