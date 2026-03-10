import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const from = 0;

    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(from + (target - from) * ease(progress));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return Math.round(value * 100) / 100;
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function StatCard({ icon: Icon, label, value, trend, trendLabel, type, isPercent }) {
  const animated = useCountUp(Math.abs(value));
  const isNegative = value < 0;

  const valueColor =
    type === 'income' ? 'text-income' :
    type === 'expense' ? 'text-expense' :
    type === 'savings' ? (value >= 0 ? 'text-income' : 'text-expense') :
    'text-warm-100';

  const trendUp = trend > 0;

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col gap-4 hover:border-border-muted transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-dm-sans text-warm-400 uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center">
            <Icon size={16} strokeWidth={1.5} className="text-warm-400" />
          </div>
        )}
      </div>

      <div>
        {isPercent ? (
          <div className={`font-dm-mono text-2xl font-medium ${valueColor} flex items-baseline gap-0.5`}>
            <span>{isNegative ? '-' : ''}{Math.round(animated)}</span>
            <span className="text-warm-400 text-lg">%</span>
          </div>
        ) : (
          <div className={`font-dm-mono text-2xl font-medium ${valueColor} flex items-baseline gap-1`}>
            <span className="text-warm-400 text-lg">₹</span>
            <span>{isNegative ? '-' : ''}{formatINR(animated)}</span>
          </div>
        )}
      </div>

      {trendLabel !== undefined && (
        <div className="flex items-center gap-1.5">
          {trendUp ? (
            <TrendingUp size={13} strokeWidth={1.5} className="text-income" />
          ) : (
            <TrendingDown size={13} strokeWidth={1.5} className="text-expense" />
          )}
          <span className={`text-xs font-dm-sans ${trendUp ? 'text-income' : 'text-expense'}`}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  );
}
