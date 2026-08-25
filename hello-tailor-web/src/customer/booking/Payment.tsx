import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';
import { computePricing } from './pricing';

const METHODS = [
  { id: 'UPI', icon: '📱' },
  { id: 'Card', icon: '💳' },
  { id: 'NetBanking', icon: '🏦' },
  { id: 'Wallet', icon: '👛' },
] as const;

export default function BookingPayment() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const tailors = useStore((s) => s.tailors);
  const coupons = useStore((s) => s.coupons);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('UPI');
  const pricing = computePricing({ ...booking, couponCode: applied ? coupon : undefined }, tailor, coupons);

  return (
    <div className="pb-24">
      <ScreenHeader title="Advance Payment" subtitle="Secure your booking" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={11} total={11} label="Payment" /></div>
      <div className="p-4 sm:px-6">
        <div className="mb-5 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Order Amount</span><span className="text-[14px] text-ht-text">₹{pricing.orderAmount}</span></div>
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Delivery Fee</span><span className="text-[14px] text-ht-text">{pricing.deliveryFee ? `₹${pricing.deliveryFee}` : 'Free'}</span></div>
          {pricing.discount ? <div className="flex justify-between py-1"><span className="text-[14px] text-ht-success">Discount</span><span className="text-[14px] text-ht-success">-₹{pricing.discount}</span></div> : null}
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Tax</span><span className="text-[14px] text-ht-text">₹{pricing.tax}</span></div>
          <div className="mt-1 flex justify-between border-t border-ht-border pt-2"><span className="text-[15px] font-semibold text-ht-text">Final Payable</span><span className="text-[15px] font-semibold text-ht-navy">₹{pricing.total}</span></div>
        </div>

        <p className="mb-2 mt-3 text-[14px] font-medium text-ht-text">Have a coupon code?</p>
        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setApplied(false); }}
            placeholder="Enter coupon code"
            className="h-12 flex-1 rounded-ht-input border-[1.5px] border-ht-border px-3.5 text-[14px] text-ht-text outline-none"
          />
          <button onClick={() => setApplied(!!coupon)} className="rounded-ht-input bg-ht-navy px-4 text-[13px] font-semibold text-white">{applied ? 'Applied' : 'Apply'}</button>
        </div>
        {applied ? (
          pricing.discount ? (
            <p className="mt-1.5 text-[13px] text-ht-success">Coupon "{coupon}" applied — you saved ₹{pricing.discount}</p>
          ) : (
            <p className="mt-1.5 text-[13px] text-ht-error">Coupon "{coupon}" isn't valid for this order</p>
          )
        ) : null}

        <div className="mb-2 mt-5 flex flex-col items-center gap-1 rounded-ht-card bg-ht-gold-light p-5">
          <p className="text-[13px] text-ht-gold">Pay Now (Advance)</p>
          <p className="text-[26px] font-bold text-ht-gold">₹{pricing.advance}</p>
          <p className="text-[12px] text-ht-text-secondary">Remaining ₹{pricing.balance} payable on delivery</p>
        </div>

        <p className="mb-2 mt-3 text-[14px] font-medium text-ht-text">Payment Method</p>
        <div className="flex flex-col gap-2.5">
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <button key={m.id} onClick={() => setMethod(m.id)} className={clsx('flex items-center gap-3 rounded-ht-card border-[1.5px] p-4 text-left', active ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card')}>
                <span className="text-xl">{m.icon}</span>
                <span className="flex-1 text-[14px] font-medium text-ht-text">{m.id}</span>
                <span>{active ? '🔵' : '⚪'}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button
          label={`Pay ₹${pricing.advance} & Confirm Booking`}
          onClick={() => {
            updateBooking({ couponCode: applied && pricing.discount ? coupon : undefined });
            navigate(`/customer/booking/${tailorId}/processing?method=${method}&amount=${pricing.advance}`);
          }}
        />
      </div>
    </div>
  );
}
