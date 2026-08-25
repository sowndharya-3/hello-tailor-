// Ported from hello-tailor-app/app/(tailor)/membership.tsx — plans filtered to audience 'Tailor'.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { membershipPlans } from '@/data/seed';
import type { MembershipPlan } from '@/store/types';

const tailorPlans = membershipPlans.filter((p: MembershipPlan) => p.audience === 'Tailor');

export default function Membership() {
  const tailor = useMyTailor();
  const buyPlan = useStore((s) => s.buyPlan);
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();

  if (purchased) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">Payment Successful</h2>
        <p className="mt-2 text-[14px] text-ht-text-secondary">Your membership is now active. Enjoy your new benefits!</p>
        <Button label="Back to Profile" onClick={() => navigate('/tailor/profile', { replace: true })} className="mt-6" />
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Tailor Membership" />
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6">
        {tailor.membership !== 'None' && (
          <Card className="border border-[#F0DDAE] bg-ht-gold-light">
            <p className="flex items-center gap-2 font-semibold text-[#9C7523]">💎 Active Plan: {tailor.membership}</p>
          </Card>
        )}

        {tailorPlans.map((plan) => {
          const isActive = tailor.membership === plan.name;
          return (
            <div key={plan.id} className="overflow-hidden rounded-ht-premium border-[1.5px] bg-white" style={{ borderColor: plan.color }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: plan.color }}>
                <p className="text-[18px] font-bold text-white">{plan.name}</p>
                {isActive && <Badge label="Current Plan" tone="success" />}
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-end gap-1">
                  <p className="text-[26px] font-bold text-ht-text">₹{plan.price.toLocaleString('en-IN')}</p>
                  <p className="mb-0.5 text-[13px] text-ht-text-secondary">/ {plan.duration}</p>
                </div>
                {plan.benefits.map((b) => (
                  <p key={b} className="mb-2 flex items-center gap-2 text-[13px] text-ht-text">
                    <span style={{ color: plan.color }}>✓</span>
                    {b}
                  </p>
                ))}
                <Button
                  label={isActive ? 'Renew Plan' : 'Buy Plan'}
                  variant="gold"
                  onClick={() => { buyPlan(plan); setPurchased(true); }}
                  className="mt-2"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
