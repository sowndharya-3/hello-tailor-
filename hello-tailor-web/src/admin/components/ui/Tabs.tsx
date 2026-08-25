interface Props {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-ht-border">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            active === t ? 'border-ht-ocean text-ht-ocean' : 'border-transparent text-ht-text-secondary hover:text-ht-text'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
