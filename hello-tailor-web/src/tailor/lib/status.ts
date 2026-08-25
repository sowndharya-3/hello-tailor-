// Maps a booking/order status string to a Badge tone — shared across dashboard, bookings,
// orders and order-detail so the color language stays consistent.
export type Tone = 'ocean' | 'navy' | 'gold' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

const STAGE_TONE: Record<string, Tone> = {
  Requested: 'info',
  Accepted: 'info',
  'Pickup Scheduled': 'info',
  'Cloth Received': 'info',
  'Stitching Started': 'warning',
  'In Progress': 'warning',
  'Quality Check': 'warning',
  Ready: 'success',
  'Out for Delivery': 'success',
  Delivered: 'success',
  Rejected: 'error',
  Cancelled: 'error',
};

export function statusTone(status: string): Tone {
  return STAGE_TONE[status] ?? 'neutral';
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN');
}

export function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function hoursLeft(requestedAt: string) {
  const deadline = new Date(requestedAt).getTime() + 24 * 3600 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return 'Expiring soon';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `Respond within ${h}h ${m}m`;
}
