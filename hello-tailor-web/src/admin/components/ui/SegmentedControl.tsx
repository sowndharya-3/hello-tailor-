interface Props {
  options: string[];
  active: string;
  onChange: (v: string) => void;
}

export default function SegmentedControl({ options, active, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            active === o ? 'bg-white text-ht-navy shadow-sm' : 'text-ht-text-secondary hover:text-ht-text'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
