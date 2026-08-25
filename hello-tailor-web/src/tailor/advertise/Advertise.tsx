// Ported from hello-tailor-app/app/(tailor)/advertise.tsx. The shared Tailor type has no
// activeAd tracking field, so (unlike the source app) there's no "currently active ad" card —
// just selection + purchase, wired to buyAd().
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { adPlacements } from '@/data/seed';
import { useMyTailor, useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

export default function Advertise() {
  const tailor = useMyTailor();
  const buyAd = useStore((s) => s.buyAd);
  const [selected, setSelected] = useState(adPlacements[0].id);
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();

  const plan = adPlacements.find((p) => p.id === selected)!;

  if (purchased) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">Ad Campaign Live!</h2>
        <p className="mt-2 text-[14px] text-ht-text-secondary">Your "{plan.name}" placement is now active for {plan.duration}.</p>
        <Button label="Back to Profile" onClick={() => navigate('/tailor/profile', { replace: true })} className="mt-6" />
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Advertise Your Shop" />
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4 sm:px-6">
        <h2 className="font-semibold text-ht-text">Available Placements</h2>
        {adPlacements.map((p) => {
          const active = p.id === selected;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} className="block text-left">
              <Card className={clsx('border-[1.5px]', active ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border')}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ht-text">{p.name}</p>
                    <p className="text-[12px] text-ht-text-secondary">{p.description}</p>
                  </div>
                  <span className={active ? 'text-ht-ocean' : 'text-ht-border'}>{active ? '🔘' : '⚪'}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <p className="font-bold text-ht-text">₹{p.price}</p>
                  <p className="text-[12px] text-ht-text-secondary">/ {p.duration}</p>
                </div>
              </Card>
            </button>
          );
        })}

        <h2 className="mt-2 font-semibold text-ht-text">Preview</h2>
        <Card className="overflow-hidden p-0">
          <img src={`https://picsum.photos/seed/${tailor.shopName}/600/240`} alt="" className="h-[140px] w-full object-cover" />
          <div className="p-4">
            <Badge label="Sponsored" tone="gold" />
            <p className="mt-1.5 font-semibold text-ht-text">{tailor.shopName}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-ht-text">Payment</h2>
          <div className="mb-1 flex justify-between text-[13px]">
            <span className="text-ht-text-secondary">Placement</span>
            <span className="font-medium text-ht-text">{plan.name}</span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] text-ht-text-secondary">Total</span>
            <span className="text-[18px] font-bold text-ht-text">₹{plan.price}</span>
          </div>
          <Button label={`Pay ₹${plan.price} & Activate`} variant="gold" onClick={() => { buyAd(plan.name, 7); setPurchased(true); }} />
        </Card>
      </div>
    </div>
  );
}
