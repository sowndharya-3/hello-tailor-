// Shared pricing math for the booking flow — ported verbatim from the RN app's booking/[tailorId]/_pricing.ts.
import type { BookingDraft } from '@/store/useStore';
import type { Tailor, Coupon } from '@/store/types';

export function computePricing(booking: BookingDraft, tailor: Tailor | undefined, coupons: Coupon[]) {
  const service = tailor?.services.find((s) => s.name.toLowerCase().includes((booking.category ?? '').toLowerCase()));
  const unitPrice = service?.price ?? tailor?.startingPrice ?? 400;
  const quantity = booking.quantity ?? 1;
  const orderAmount = unitPrice * quantity;

  const methodFee = booking.method === 'Tailor Pickup' ? 49 : booking.method === 'Home Delivery' ? 59 : 0;

  let discount = 0;
  if (booking.couponCode) {
    const coupon = coupons.find((c) => c.code === booking.couponCode!.toUpperCase() && c.status === 'Active');
    if (coupon && orderAmount >= coupon.minBooking) {
      discount = coupon.discountType === 'Percentage'
        ? Math.min(coupon.maxDiscount, Math.round(orderAmount * (coupon.discountValue / 100)))
        : Math.min(coupon.maxDiscount || coupon.discountValue, coupon.discountValue);
    }
  }

  const taxable = orderAmount + methodFee - discount;
  const tax = Math.round(taxable * 0.05);
  const total = taxable + tax;
  const advance = Math.round(orderAmount * 0.4);
  const balance = total - advance;

  return { unitPrice, quantity, orderAmount, deliveryFee: methodFee, discount, tax, total, advance, balance };
}
