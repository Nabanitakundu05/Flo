export function StatCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton w-8 h-8 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-32 rounded-lg" />
      <div className="skeleton h-3 w-20 rounded-full" />
    </div>
  );
}
