import { useStore } from '@/store/useStore';
import type { Coupon } from '@/store/types';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

function discountLabel(c: Coupon) {
  return c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;
}
function termsLabel(c: Coupon) {
  const bits = [`Eligible: ${c.eligibility}`];
  if (c.maxDiscount) bits.push(`Max discount ₹${c.maxDiscount}`);
  return bits.join(' • ');
}

export default function Offers() {
  const coupons = useStore((s) => s.coupons).filter((c) => c.status === 'Active');

  return (
    <div>
      <ScreenHeader title="Offers & Coupons" />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {coupons.length ? coupons.map((item) => (
          <div key={item.id} className="rounded-ht-card border border-ht-gold bg-ht-gold-light p-4">
            <div className="flex items-start justify-between">
              <Badge label={discountLabel(item)} tone="gold" />
              <span className="text-[12px] text-ht-text-secondary">Valid till {item.validTo}</span>
            </div>
            <p className="mt-2 text-[16px] font-semibold text-ht-text">{item.title}</p>
            <div className="mt-2.5 flex items-center justify-between rounded-ht-input border border-dashed border-ht-border p-2.5">
              <span className="text-[14px] font-bold tracking-wide text-ht-navy">{item.code}</span>
              <Button label="Apply" fullWidth={false} className="min-h-[36px] px-4" onClick={() => window.alert(`Coupon Applied: ${item.code} will be applied at checkout.`)} />
            </div>
            <p className="mt-2 text-[12px] text-ht-text-secondary">Min order ₹{item.minBooking} • {termsLabel(item)}</p>
          </div>
        )) : (
          <EmptyState icon="🏷️" title="No Offers Available" message="Check back soon for new discounts and coupons." />
        )}
      </div>
    </div>
  );
}
