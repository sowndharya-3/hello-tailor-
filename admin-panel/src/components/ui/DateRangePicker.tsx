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
        className="rounded-xl border border-border px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20"
      />
      <span className="text-text-secondary text-sm">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange(from, e.target.value)}
        className="rounded-xl border border-border px-3 py-2.5 text-sm text-text-primary outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20"
      />
    </div>
  );
}
