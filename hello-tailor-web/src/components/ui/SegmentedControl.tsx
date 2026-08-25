import { clsx } from './clsx';

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-ht-input bg-ht-disabled-bg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded-[9px] px-4 py-1.5 text-[13px] font-medium transition-colors',
            value === opt.value ? 'bg-white text-ht-navy shadow-sm' : 'text-ht-text-secondary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
