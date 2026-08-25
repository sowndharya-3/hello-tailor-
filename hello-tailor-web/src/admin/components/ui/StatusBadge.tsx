import { CheckCircle2, Clock, XCircle, AlertCircle, Ban, PauseCircle } from 'lucide-react';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const toneMap: Record<string, { tone: Tone; icon: typeof CheckCircle2 }> = {
  Active: { tone: 'success', icon: CheckCircle2 },
  Verified: { tone: 'success', icon: CheckCircle2 },
  Paid: { tone: 'success', icon: CheckCircle2 },
  Collected: { tone: 'success', icon: CheckCircle2 },
  Resolved: { tone: 'success', icon: CheckCircle2 },
  Delivered: { tone: 'success', icon: CheckCircle2 },
  Visible: { tone: 'success', icon: CheckCircle2 },
  Sent: { tone: 'success', icon: CheckCircle2 },
  Closed: { tone: 'neutral', icon: CheckCircle2 },
  Pending: { tone: 'warning', icon: Clock },
  Scheduled: { tone: 'warning', icon: Clock },
  Partial: { tone: 'warning', icon: Clock },
  'In Progress': { tone: 'warning', icon: Clock },
  'In Stitching': { tone: 'warning', icon: Clock },
  Requested: { tone: 'warning', icon: Clock },
  Accepted: { tone: 'info', icon: CheckCircle2 },
  'Pickup Scheduled': { tone: 'warning', icon: Clock },
  'Cloth Received': { tone: 'info', icon: CheckCircle2 },
  'Stitching Started': { tone: 'warning', icon: Clock },
  'Quality Check': { tone: 'warning', icon: Clock },
  Blocked: { tone: 'error', icon: Ban },
  Rejected: { tone: 'error', icon: XCircle },
  Failed: { tone: 'error', icon: XCircle },
  Cancelled: { tone: 'error', icon: XCircle },
  Expired: { tone: 'error', icon: XCircle },
  Open: { tone: 'error', icon: AlertCircle },
  Urgent: { tone: 'error', icon: AlertCircle },
  High: { tone: 'warning', icon: AlertCircle },
  Medium: { tone: 'info', icon: AlertCircle },
  Low: { tone: 'neutral', icon: AlertCircle },
  Inactive: { tone: 'neutral', icon: PauseCircle },
  Paused: { tone: 'neutral', icon: PauseCircle },
  Hidden: { tone: 'neutral', icon: PauseCircle },
  Refunded: { tone: 'info', icon: AlertCircle },
};

const toneClass: Record<Tone, string> = {
  success: 'bg-[#ECFDF3] text-ht-success',
  warning: 'bg-[#FFFAEB] text-ht-warning',
  error: 'bg-[#FEF3F2] text-ht-error',
  info: 'bg-ht-info-bg text-ht-ocean',
  neutral: 'bg-ht-disabled-bg text-ht-disabled-text',
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = toneMap[status] ?? { tone: 'neutral' as Tone, icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[cfg.tone]}`}>
      <Icon size={13} strokeWidth={2.5} />
      {status}
    </span>
  );
}
