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
      {label && <label htmlFor={selId} className="text-sm font-medium text-ht-text">{label}</label>}
      <div className="relative">
        <select
          id={selId}
          className={`w-full appearance-none rounded-xl border border-ht-border bg-white px-3.5 py-2.5 pr-9 text-sm text-ht-text outline-none focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20 disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text ${className}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ht-text-secondary" />
      </div>
    </div>
  );
}
