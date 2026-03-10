import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} strokeWidth={1.5} className="text-income" />,
  error: <AlertCircle size={16} strokeWidth={1.5} className="text-expense" />,
  info: <Info size={16} strokeWidth={1.5} className="text-accent-indigo" />,
};

function ToastItem({ toast, onRemove }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border-subtle bg-bg-elevated min-w-[280px] max-w-[360px] ${
        toast.exiting ? 'toast-exit' : 'toast-enter'
      }`}
    >
      {icons[toast.type] || icons.info}
      <p className="flex-1 text-sm text-warm-100 font-dm-sans">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-warm-400 hover:text-warm-200 transition-colors duration-150 flex-shrink-0"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
