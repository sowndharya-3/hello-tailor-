import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from './clsx';

type Variant = 'primary' | 'secondary' | 'gold' | 'destructive' | 'ghost';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label?: string;
  children?: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-ht-ocean text-white hover:brightness-110 active:brightness-95',
  secondary: 'bg-white text-ht-ocean border border-ht-ocean hover:bg-ht-ocean/5',
  gold: 'bg-ht-gold text-ht-navy hover:brightness-105',
  destructive: 'bg-ht-error text-white hover:brightness-110',
  ghost: 'bg-transparent text-ht-navy hover:bg-ht-navy/5',
};

export default function Button({
  label,
  children,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-ht-button px-5 font-semibold text-[15px] min-h-[50px] transition-all',
        fullWidth && 'w-full',
        disabled ? 'bg-ht-disabled-bg text-ht-disabled-text cursor-not-allowed' : VARIANT_CLASS[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {label ?? children}
    </button>
  );
}
