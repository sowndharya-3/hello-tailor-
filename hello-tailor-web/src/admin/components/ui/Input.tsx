import type { InputHTMLAttributes } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  hint?: string;
}

export default function Input({ label, error, success, optional, hint, className = '', id, ...rest }: Props) {
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ht-text">
          {label} {optional ? <span className="text-ht-text-secondary font-normal">(optional)</span> : <span className="text-ht-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-ht-text placeholder:text-ht-disabled-text outline-none transition-colors focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20 disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text
            ${error ? 'border-ht-error focus:border-ht-error focus:ring-ht-error/20' : success ? 'border-ht-success' : 'border-ht-border'} ${className}`}
          {...rest}
        />
        {error && <AlertCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ht-error" />}
        {success && !error && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ht-success" />}
      </div>
      {error && <span className="text-xs font-medium text-ht-error">{error}</span>}
      {success && !error && <span className="text-xs font-medium text-ht-success">{success}</span>}
      {hint && !error && !success && <span className="text-xs text-ht-text-secondary">{hint}</span>}
    </div>
  );
}
