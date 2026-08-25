import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function Section({ title, actionTo, children }: { title: string; actionTo?: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6">
        <h2 className="text-[17px] font-semibold text-ht-text">{title}</h2>
        {actionTo ? (
          <Link to={actionTo} className="text-[13px] font-semibold text-ht-ocean">See All</Link>
        ) : null}
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6">{children}</div>
    </div>
  );
}
