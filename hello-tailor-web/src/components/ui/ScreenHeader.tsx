import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function ScreenHeader({ title, subtitle, back = true, right }: { title: string; subtitle?: string; back?: boolean; right?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between border-b border-ht-border bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-3">
        {back ? (
          <button onClick={() => navigate(-1)} aria-label="Back" className="text-xl text-ht-navy">
            ‹
          </button>
        ) : null}
        <div>
          <h1 className="text-[18px] font-semibold text-ht-text">{title}</h1>
          {subtitle ? <p className="text-[13px] text-ht-text-secondary">{subtitle}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}
