import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({ title, description, icon, ctaLabel, onCta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-text-secondary">
        {icon ?? <Inbox size={26} />}
      </div>
      <h4 className="text-base font-semibold text-text-primary">{title}</h4>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {ctaLabel && onCta && (
        <Button variant="primary" size="sm" onClick={onCta} className="mt-2">{ctaLabel}</Button>
      )}
    </div>
  );
}
