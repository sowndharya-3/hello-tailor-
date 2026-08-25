import type { InputHTMLAttributes } from 'react';
import { clsx } from './clsx';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  optional?: boolean;
  error?: string;
  success?: string;
  hint?: string;
}

export default function Input({ label, optional, error, success, hint, id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const borderClass = error
    ? 'border-ht-error focus:border-ht-error'
    : success
    ? 'border-ht-success focus:border-ht-success'
    : 'border-ht-border focus:border-ht-ocean';
  return (
    <div className="mb-3 w-full text-left">
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-ht-text">
          {label} {optional ? <span className="text-ht-text-secondary">(optional)</span> : <span className="text-ht-error">*</span>}
        </label>
      ) : null}
      <input
        id={inputId}
        name={inputId}
        className={clsx(
          'w-full min-h-[50px] rounded-ht-input border-[1.5px] bg-white px-4 text-[15px] text-ht-text outline-none transition-colors placeholder:text-ht-disabled-text',
          borderClass,
        )}
        {...rest}
      />
      {error ? <p className="mt-1 text-[13px] text-ht-error">{error}</p> : null}
      {!error && success ? <p className="mt-1 text-[13px] text-ht-success">{success}</p> : null}
      {!error && !success && hint ? <p className="mt-1 text-[13px] text-ht-text-secondary">{hint}</p> : null}
    </div>
  );
}
