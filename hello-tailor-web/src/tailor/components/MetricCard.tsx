import { clsx } from '@/components/ui/clsx';

type Tone = 'ocean' | 'navy' | 'gold' | 'success';

const TONE_CLASS: Record<Tone, string> = {
  ocean: 'bg-ht-ocean text-white',
  navy: 'bg-ht-navy text-white',
  gold: 'bg-ht-gold text-ht-navy',
  success: 'bg-ht-success text-white',
};

export default function MetricCard({
  label,
  value,
  icon,
  tone = 'ocean',
  onClick,
  wide,
}: {
  label: string;
  value: string;
  icon: string;
  tone?: Tone;
  onClick?: () => void;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 rounded-ht-card bg-ht-card p-4 text-left shadow-[0_4px_12px_rgba(23,59,87,0.06)] transition-transform hover:-translate-y-0.5',
        wide ? 'w-full' : '',
      )}
    >
      <span className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg', TONE_CLASS[tone])}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[20px] font-bold leading-tight text-ht-text">{value}</span>
        <span className="block truncate text-[12px] text-ht-text-secondary">{label}</span>
      </span>
    </button>
  );
}
