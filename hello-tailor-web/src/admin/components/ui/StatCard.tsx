import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: number;
  gold?: boolean;
}

export default function StatCard({ label, value, icon, trend, gold }: Props) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${gold ? 'bg-ht-gold-light border-ht-gold/30' : 'bg-ht-card border-ht-border'}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ht-text-secondary">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${gold ? 'bg-ht-gold/15 text-ht-gold' : 'bg-ht-ocean/10 text-ht-ocean'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[26px] font-bold text-ht-navy leading-none">{value}</span>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-ht-success' : 'text-ht-error'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
