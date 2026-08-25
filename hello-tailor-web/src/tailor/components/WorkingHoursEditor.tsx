// Ported from hello-tailor-app/components/tailor/WorkingHoursEditor.tsx + its DayTimeRow ui
// component (no web equivalent exists yet, so the row is inlined here — it's only used here).
import type { DayHours } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

export function WorkingHoursEditor({ hours, onChange }: { hours: DayHours[]; onChange: (h: DayHours[]) => void }) {
  const updateDay = (idx: number, row: DayHours) => {
    const next = [...hours];
    next[idx] = row;
    onChange(next);
  };

  const applyToAll = (idx: number) => {
    const source = hours[idx];
    onChange(hours.map((h) => (h.open ? { ...h, from: source.from, to: source.to } : h)));
  };

  return (
    <div className="flex flex-col gap-2">
      {hours.map((row, idx) => (
        <div key={row.day} className="flex flex-wrap items-center gap-3 rounded-ht-card border border-ht-border bg-white p-3.5">
          <button
            onClick={() => updateDay(idx, { ...row, open: !row.open })}
            className={clsx(
              'flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors',
              row.open ? 'justify-end bg-ht-success' : 'justify-start bg-ht-disabled-bg',
            )}
            aria-label={`Toggle ${row.day} open`}
          >
            <span className="h-5 w-5 rounded-full bg-white shadow" />
          </button>
          <span className="w-10 font-semibold text-ht-text">{row.day}</span>
          {row.open ? (
            <>
              <input
                type="time"
                value={row.from}
                onChange={(e) => updateDay(idx, { ...row, from: e.target.value })}
                className="rounded-ht-input border border-ht-border px-2 py-1.5 text-[13px] text-ht-text"
              />
              <span className="text-ht-text-secondary">to</span>
              <input
                type="time"
                value={row.to}
                onChange={(e) => updateDay(idx, { ...row, to: e.target.value })}
                className="rounded-ht-input border border-ht-border px-2 py-1.5 text-[13px] text-ht-text"
              />
              <button onClick={() => applyToAll(idx)} className="ml-auto text-[12px] font-medium text-ht-ocean">
                Apply to all
              </button>
            </>
          ) : (
            <span className="text-[13px] text-ht-text-secondary">Closed</span>
          )}
        </div>
      ))}
    </div>
  );
}
