import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faqs } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';

function NavRow({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-ht-border py-3.5 text-left last:border-b-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-info-bg text-lg">{icon}</div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-ht-text">{label}</p>
        <p className="text-[12px] text-ht-text-secondary">{sub}</p>
      </div>
      <span className="text-ht-disabled-text">›</span>
    </button>
  );
}

export default function Support() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div>
      <ScreenHeader title="Help & Support" />
      <div className="p-4 pb-8 sm:px-6">
        <div className="rounded-ht-card border border-ht-border bg-ht-card px-4">
          <NavRow icon="💬" label="Support Chat" sub="Chat with our team, usually replies in minutes" onClick={() => navigate('/customer/profile/support/chat')} />
          <NavRow icon="📞" label="Call Support" sub="+91 44 4567 8901" onClick={() => window.open('tel:+914445678901')} />
          <NavRow icon="✉️" label="Email Support" sub="support@hellotailor.in" onClick={() => window.open('mailto:support@hellotailor.in')} />
          <NavRow icon="⚠️" label="Raise a Ticket" sub="Report an order issue" onClick={() => navigate('/customer/profile/complaints/new')} />
        </div>

        <p className="mb-3 mt-6 text-[16px] font-semibold text-ht-text">Frequently Asked Questions</p>
        {faqs.map((f, i) => {
          const open = openIdx === i;
          return (
            <button key={f.q} onClick={() => setOpenIdx(open ? null : i)} className="mb-2.5 block w-full rounded-ht-card border border-ht-border bg-ht-card p-4 text-left">
              <div className="flex items-center justify-between">
                <span className="flex-1 pr-2 text-[14px] font-medium text-ht-text">{f.q}</span>
                <span className="text-ht-text-secondary">{open ? '▲' : '▼'}</span>
              </div>
              {open ? <p className="mt-2.5 text-[14px] text-ht-text-secondary">{f.a}</p> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
