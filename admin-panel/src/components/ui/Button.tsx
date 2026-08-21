import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'gold' | 'destructive' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-ocean text-white hover:bg-[#0a6a9e] disabled:bg-disabled-bg disabled:text-disabled-text',
  secondary: 'bg-white text-navy border border-border hover:bg-slate-50 disabled:bg-disabled-bg disabled:text-disabled-text',
  gold: 'bg-gold text-navy hover:bg-[#c6913a] disabled:bg-disabled-bg disabled:text-disabled-text',
  destructive: 'bg-error text-white hover:bg-[#b8271c] disabled:bg-disabled-bg disabled:text-disabled-text',
  ghost: 'bg-transparent text-text-secondary hover:bg-slate-100 disabled:text-disabled-text',
};

export default function Button({ variant = 'primary', icon, size = 'md', className = '', children, ...rest }: Props) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-[15px]';
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${sizeClass} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
