const WIDTHS = ['w-32', 'w-24', 'w-28', 'w-36'];
const CAT_WIDTHS = ['w-16', 'w-20', 'w-14', 'w-18'];

export function TransactionRowSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-border-subtle">
      {WIDTHS.map((w, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
          <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className={`skeleton h-3.5 ${w} rounded-full`} />
            <div className={`skeleton h-2.5 ${CAT_WIDTHS[i]} rounded-full`} />
          </div>
          <div className="skeleton h-3 w-10 rounded-full hidden sm:block" />
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
