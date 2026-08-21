import { BookingDraft } from '../store/AppState';
import { tailors } from './data';

// ponytail: simplified mock pricing model — not a real rate card, just enough to demo the flow end-to-end.
export function computePricing(booking: BookingDraft) {
  const tailor = tailors.find((t) => t.id === booking.tailorId);
  const service = tailor?.services.find((s) => s.name.toLowerCase().includes((booking.category ?? '').toLowerCase()));
  const unitPrice = service?.price ?? tailor?.startingPrice ?? 400;
  const quantity = booking.quantity ?? 1;
  const orderAmount = unitPrice * quantity;

  const methodFee = booking.method === 'Tailor Pickup' ? 49 : booking.method === 'Home Delivery' ? 59 : 0;
  const discount = booking.couponCode ? Math.min(150, Math.round(orderAmount * 0.15)) : 0;
  const taxable = orderAmount + methodFee - discount;
  const tax = Math.round(taxable * 0.05);
  const total = taxable + tax;
  const advance = Math.round(orderAmount * 0.4);
  const balance = total - advance;

  return { unitPrice, quantity, orderAmount, deliveryFee: methodFee, discount, tax, total, advance, balance };
}
