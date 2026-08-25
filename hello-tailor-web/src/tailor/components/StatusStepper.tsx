// Vertical progress stepper for order stages, driven by the shared BOOKING_STAGES list.
// Ported from hello-tailor-app/components/tailor/StatusStepper.tsx.
import { BOOKING_STAGES } from '@/store/types';
import { clsx } from '@/components/ui/clsx';

export function StatusStepper({ current }: { current: string }) {
  const idx = BOOKING_STAGES.indexOf(current as (typeof BOOKING_STAGES)[number]);

  return (
    <div>
      {BOOKING_STAGES.map((stage, i) => {
        const done = i < idx;
        const active = i === idx;
        const isLast = i === BOOKING_STAGES.length - 1;
        return (
          <div key={stage} className="flex">
            <div className="flex w-7 flex-col items-center">
              <div
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-white',
                  done ? 'bg-ht-success' : active ? 'border-[3px] border-ht-ocean bg-white' : 'bg-ht-disabled-bg',
                )}
              >
                {done ? '✓' : active ? <span className="block h-2 w-2 rounded-full bg-ht-ocean" /> : null}
              </div>
              {!isLast && <div className={clsx('mt-0.5 w-0.5 flex-1', done || active ? 'bg-ht-success' : 'bg-ht-disabled-bg')} />}
            </div>
            <div className="flex-1 pb-5 pl-3">
              <p className={clsx('text-[14px]', done || active ? 'font-semibold text-ht-text' : 'text-ht-text-secondary')}>{stage}</p>
              {active && <p className="mt-0.5 text-[11px] font-medium text-ht-ocean">Current stage</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
