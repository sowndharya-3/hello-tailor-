interface Props {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            active === t ? 'border-ocean text-ocean' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
