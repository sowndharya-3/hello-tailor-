import { ReasonSheet } from '@/components/ReasonSheet';

const REASONS = [
  'Fully booked for this delivery window',
  'Customer location out of service area',
  'Requested fabric/design not feasible',
  'Price mismatch with customer expectations',
  'Other',
];

export function RejectSheet({ visible, onClose, onConfirm }: { visible: boolean; onClose: () => void; onConfirm: (reason: string, note: string) => void }) {
  return (
    <ReasonSheet
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Reject Booking Request"
      reasons={REASONS}
      confirmLabel="Reject Booking"
      confirmMessage="This action cannot be undone. The customer will be notified immediately."
    />
  );
}
