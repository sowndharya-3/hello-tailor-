export function SkeletonLine({ width = '100%', height = '14px' }: { width?: string; height?: string }) {
  return <div className="animate-pulse rounded-md bg-slate-200" style={{ width, height }} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-ht-border bg-ht-card p-5 flex flex-col gap-3">
      <SkeletonLine width="40%" height="12px" />
      <SkeletonLine width="60%" height="24px" />
      <SkeletonLine width="30%" height="10px" />
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonLine key={c} width={c === 0 ? '15%' : `${100 / cols}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}
