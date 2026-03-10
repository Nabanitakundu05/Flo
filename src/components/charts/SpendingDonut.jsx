import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORIES } from '../TransactionModal';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3">
      <p className="text-xs text-warm-400 font-dm-sans">{name}</p>
      <p className="font-dm-mono text-sm text-warm-100 mt-0.5">
        ₹{new Intl.NumberFormat('en-IN').format(value)}
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-warm-400 font-dm-sans">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CenterLabel({ viewBox, totalSpend }) {
  if (!viewBox || typeof viewBox.cx !== 'number' || typeof viewBox.cy !== 'number') {
    return null;
  }
  const { cx, cy } = viewBox;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#888680" fontSize="11" fontFamily="DM Sans">
        Total
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#e8e6e0" fontSize="14" fontFamily="DM Mono" fontWeight="500">
        ₹{new Intl.NumberFormat('en-IN').format(totalSpend)}
      </text>
    </g>
  );
}

export function SpendingDonut({ transactions }) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalSpend = expenses.reduce((s, t) => s + Number(t.amount), 0);

  const byCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const data = Object.entries(byCategory).map(([key, value]) => {
    const cat = CATEGORIES.find((c) => c.value === key) || CATEGORIES[CATEGORIES.length - 1];
    return { name: cat.label, value, color: cat.color };
  }).sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-dm-sans font-medium text-warm-200">Spending by Category</h3>
          <span className="text-xs text-warm-500 font-dm-sans">This month</span>
        </div>
        <div className="flex-1 flex items-center justify-center h-52 text-warm-500 text-sm font-dm-sans">
          No expenses recorded
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-dm-sans font-medium text-warm-200">Spending by Category</h3>
        <span className="text-xs text-warm-500 font-dm-sans">This month</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive
            animationDuration={800}
            labelLine={false}
            label={<CenterLabel totalSpend={totalSpend} />}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
