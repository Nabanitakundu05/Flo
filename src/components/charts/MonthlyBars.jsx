import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 min-w-[140px]">
      <p className="text-xs text-warm-400 font-dm-sans mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span className="text-xs font-dm-sans" style={{ color: p.fill }}>{p.name}</span>
          <span className="font-dm-mono text-xs text-warm-100">₹{new Intl.NumberFormat('en-IN').format(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
    });
  }
  return months;
}

export function MonthlyBars() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const months = getLast6Months();
      const start = `${months[0].year}-${String(months[0].month).padStart(2, '0')}-01`;
      const last = months[months.length - 1];
      const end = new Date(last.year, last.month, 0).toISOString().slice(0, 10);

      const { data: rows } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end);

      const grouped = months.map(({ month, year, label }) => {
        const monthRows = (rows || []).filter((r) => {
          const d = new Date(r.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        });
        const income = monthRows.filter((r) => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
        const expense = monthRows.filter((r) => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
        return { month: label, Income: income, Expense: expense };
      });

      setData(grouped);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="skeleton h-4 w-32 rounded-full" />
          <div className="skeleton h-3 w-20 rounded-full" />
        </div>
        <div className="skeleton rounded-xl" style={{ height: 220 }} />
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-dm-sans font-medium text-warm-200">Income vs Expenses</h3>
        <span className="text-xs text-warm-500 font-dm-sans">Last 6 months</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="35%" barGap={4}>
          <CartesianGrid vertical={false} stroke="#1f1f2e" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#585650', fontSize: 11, fontFamily: 'DM Sans' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#585650', fontSize: 10, fontFamily: 'DM Mono' }}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="Income" fill="#4ade80" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
          <Bar dataKey="Expense" fill="#f87171" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-income" />
          <span className="text-xs text-warm-400 font-dm-sans">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-expense" />
          <span className="text-xs text-warm-400 font-dm-sans">Expense</span>
        </div>
      </div>
    </div>
  );
}
