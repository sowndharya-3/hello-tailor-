interface Props {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export default function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onChange(e.target.value, to)}
        className="rounded-xl border border-ht-border px-3 py-2.5 text-sm text-ht-text outline-none focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20"
      />
      <span className="text-ht-text-secondary text-sm">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange(from, e.target.value)}
        className="rounded-xl border border-ht-border px-3 py-2.5 text-sm text-ht-text outline-none focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20"
      />
    </div>
  );
}
