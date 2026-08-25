// Ported from hello-tailor-app/app/(tailor)/featured.tsx — the shared Tailor type DOES have a
// `featured` boolean, so purchase flips it via updateTailorProfile.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

const OPTIONS = [
  { days: 7, price: 349 },
  { days: 15, price: 599 },
  { days: 30, price: 999 },
];

export default function Featured() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [selected, setSelected] = useState(OPTIONS[1]);
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();

  if (purchased) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">You're Featured!</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ht-text-secondary">Your profile now shows the Featured badge and gets priority placement.</p>
        <Button label="Back to Profile" onClick={() => navigate('/tailor/profile', { replace: true })} className="mt-6" />
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Featured Listing" />
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-col items-center rounded-ht-premium bg-ht-navy p-6 text-center">
          <span className="text-3xl">⭐</span>
          <p className="mt-2 text-[20px] font-bold text-white">Get Seen First</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#C9D8E3]">
            Featured shops appear at the top of category search results with a gold badge, boosting visibility by up to 3x.
          </p>
        </div>

        {tailor.featured && (
          <Card className="border border-[#F0DDAE] bg-ht-gold-light">
            <p className="flex items-center gap-2 font-semibold text-[#9C7523]">⭐ Featured Active</p>
          </Card>
        )}

        <h2 className="font-semibold text-ht-text">Choose Duration</h2>
        <div className="flex gap-2.5">
          {OPTIONS.map((opt) => {
            const active = opt.days === selected.days;
            return (
              <button
                key={opt.days}
                onClick={() => setSelected(opt)}
                className={clsx(
                  'flex-1 rounded-ht-input border-[1.5px] bg-white py-3.5 text-center',
                  active ? 'border-ht-gold bg-ht-gold-light' : 'border-ht-border',
                )}
              >
                <p className={clsx('font-semibold', active ? 'text-[#9C7523]' : 'text-ht-text')}>{opt.days} days</p>
                <p className={clsx('mt-1 text-[12px]', active ? 'text-[#9C7523]' : 'text-ht-text-secondary')}>₹{opt.price}</p>
              </button>
            );
          })}
        </div>

        <Card>
          <h2 className="mb-3 font-semibold text-ht-text">What you get</h2>
          {['Gold "Featured" badge on your profile', 'Top placement in category search', 'Highlighted card on customer home screen'].map((b) => (
            <p key={b} className="mb-2 flex items-center gap-2 text-[13px] text-ht-text">
              <span className="text-ht-gold">✓</span>
              {b}
            </p>
          ))}
          <Button
            label={`Pay ₹${selected.price} & Go Featured`}
            variant="gold"
            onClick={() => { updateTailorProfile({ featured: true }); setPurchased(true); }}
            className="mt-2"
          />
        </Card>
      </div>
    </div>
  );
}
