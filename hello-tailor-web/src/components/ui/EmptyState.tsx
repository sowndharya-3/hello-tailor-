import type { ReactNode } from 'react';

export default function EmptyState({
  icon = '🗂️',
  title,
  message,
  action,
}: {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-6">
      <div className="text-4xl">{icon}</div>
      <p className="text-[16px] font-semibold text-ht-text">{title}</p>
      {message ? <p className="max-w-xs text-[13px] text-ht-text-secondary">{message}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
