import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export default function Select({ label, options, placeholder, className = '', id, ...rest }: Props) {
  const selId = id ?? label?.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={selId} className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative">
        <select
          id={selId}
          className={`w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 pr-9 text-sm text-text-primary outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 disabled:bg-disabled-bg disabled:text-disabled-text ${className}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
      </div>
    </div>
  );
}
