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
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label} {optional ? <span className="text-text-secondary font-normal">(optional)</span> : <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-primary placeholder:text-disabled-text outline-none transition-colors focus:border-ocean focus:ring-2 focus:ring-ocean/20 disabled:bg-disabled-bg disabled:text-disabled-text
            ${error ? 'border-error focus:border-error focus:ring-error/20' : success ? 'border-success' : 'border-border'} ${className}`}
          {...rest}
        />
        {error && <AlertCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-error" />}
        {success && !error && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />}
      </div>
      {error && <span className="text-xs font-medium text-error">{error}</span>}
      {success && !error && <span className="text-xs font-medium text-success">{success}</span>}
      {hint && !error && !success && <span className="text-xs text-text-secondary">{hint}</span>}
    </div>
  );
}
