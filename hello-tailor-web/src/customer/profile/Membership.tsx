import { useState } from 'react';
import { membershipPlans } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const customerPlans = membershipPlans.filter((p) => p.audience === 'Customer');

export default function Membership() {
  const [active, setActive] = useState(false);
  const [planId, setPlanId] = useState(customerPlans[0]?.id);

  return (
    <div>
      <ScreenHeader title="Hello Tailor Membership" />
      <div className="p-4 pb-8 sm:px-6">
        <div className="flex flex-col items-center gap-1.5 rounded-ht-premium bg-ht-navy p-6 text-center">
          <span className="text-4xl">🎖️</span>
          <p className="mt-1 text-[20px] font-semibold text-white">Hello Tailor Gold</p>
          <p className="text-[14px] text-white/80">{active ? 'Your membership is active until 20 Nov 2026' : 'Unlock premium perks on every order'}</p>
        </div>

        <p className="mt-6 mb-2.5 text-[16px] font-semibold text-ht-text">Benefits</p>
        {['Free pickup & delivery on every order', 'Up to 15% off stitching charges', 'Priority stitching slots', '2 free alterations every month', 'Early access to new tailors'].map((b) => (
          <div key={b} className="mb-2.5 flex items-center gap-2.5">
            <span className="text-ht-gold">✔️</span>
            <p className="flex-1 text-[14px] text-ht-text">{b}</p>
          </div>
        ))}

        <p className="mt-6 mb-2.5 text-[16px] font-semibold text-ht-text">Choose a Plan</p>
        {customerPlans.map((p) => {
          const isSelected = planId === p.id;
          return (
            <button key={p.id} onClick={() => setPlanId(p.id)} className={clsx('mb-3 w-full rounded-ht-premium border-[1.5px] p-4 text-left', isSelected ? 'border-ht-gold bg-ht-gold-light' : 'border-ht-border bg-ht-card')}>
              <div className="flex justify-between">
                <span className="text-[16px] font-semibold text-ht-text">{p.name}</span>
                <span className="text-[16px] font-semibold text-ht-gold">₹{p.price}</span>
              </div>
              <p className="mb-2 mt-0.5 text-[12px] text-ht-text-secondary">{p.duration}</p>
              {p.benefits.map((b) => <p key={b} className="mt-0.5 text-[12px] text-ht-text-secondary">• {b}</p>)}
            </button>
          );
        })}

        <Button label={active ? 'Renew Membership' : 'Activate Membership'} variant="gold" className="mt-3" onClick={() => { setActive(true); window.alert('Subscribed! Welcome to Hello Tailor Gold!'); }} />
      </div>
    </div>
  );
}
