import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'gold' | 'destructive' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-ht-ocean text-white hover:bg-[#0a6a9e] disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text',
  secondary: 'bg-white text-ht-navy border border-ht-border hover:bg-slate-50 disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text',
  gold: 'bg-ht-gold text-ht-navy hover:bg-[#c6913a] disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text',
  destructive: 'bg-ht-error text-white hover:bg-[#b8271c] disabled:bg-ht-disabled-bg disabled:text-ht-disabled-text',
  ghost: 'bg-transparent text-ht-text-secondary hover:bg-slate-100 disabled:text-ht-disabled-text',
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
