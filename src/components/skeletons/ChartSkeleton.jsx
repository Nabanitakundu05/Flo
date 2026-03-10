export function ChartSkeleton({ height = 220 }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-3 w-20 rounded-full" />
      </div>
      <div className="skeleton rounded-xl" style={{ height }} />
      <div className="flex gap-4 mt-4 justify-center">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}
