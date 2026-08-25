// Small formatting + derived-field helpers shared by admin pages.
// The admin panel was originally built against its own mockData shapes (Order, etc.);
// the merged app's store uses slightly different field names (Booking, bookingDate, ...).
// These helpers bridge that gap without needing to touch the shared store types.
import type { Booking, BookingStatus } from '@/store/types';

export function formatMoney(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ponytail: the store models payment as advancePaid/balancePaid booleans rather than a
// dedicated PaymentStatus enum (that lives only on the standalone Payment records) — derive
// a Paid/Partial/Pending label for a booking from those flags.
export function bookingPaymentStatus(b: Booking): 'Paid' | 'Partial' | 'Pending' {
  if (b.advancePaid && b.balancePaid) return 'Paid';
  if (b.advancePaid) return 'Partial';
  return 'Pending';
}

export const ORDER_STAGES: BookingStatus[] = [
  'Requested', 'Accepted', 'Pickup Scheduled', 'Cloth Received', 'Stitching Started',
  'In Progress', 'Quality Check', 'Ready', 'Out for Delivery', 'Delivered',
];

export function bookingBalance(b: Booking): number {
  return Math.max(0, b.amount - b.advanceAmount);
}
