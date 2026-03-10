import { Plus } from 'lucide-react';

export function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-accent-indigo hover:bg-accent-indigo-dim rounded-2xl flex items-center justify-center shadow-lg btn-press transition-colors duration-200 z-40 group"
      aria-label="Add transaction"
    >
      <Plus
        size={22}
        strokeWidth={1.5}
        className="text-white transition-transform duration-200 group-hover:rotate-90"
      />
    </button>
  );
}
