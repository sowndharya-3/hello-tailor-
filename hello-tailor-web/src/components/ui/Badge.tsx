import { clsx } from './clsx';

type Tone = 'ocean' | 'navy' | 'gold' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

const TONE_CLASS: Record<Tone, string> = {
  ocean: 'bg-ht-info-bg text-ht-ocean',
  navy: 'bg-ht-navy/10 text-ht-navy',
  gold: 'bg-ht-gold-light text-ht-gold',
  success: 'bg-ht-success/10 text-ht-success',
  error: 'bg-ht-error/10 text-ht-error',
  warning: 'bg-ht-warning/10 text-ht-warning',
  info: 'bg-ht-info-bg text-ht-ocean',
  neutral: 'bg-ht-disabled-bg text-ht-text-secondary',
};

export default function Badge({ label, tone = 'neutral', icon }: { label: string; tone?: Tone; icon?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold', TONE_CLASS[tone])}>
      {icon ? <span>{icon}</span> : null}
      {label}
    </span>
  );
}
