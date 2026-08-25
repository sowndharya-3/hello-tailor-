// Generic "pick a reason + optional note, then confirm" modal. Used for both booking
// rejection and order cancellation. Ported from hello-tailor-app/components/tailor/ReasonSheet.tsx.
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export function ReasonSheet({
  open,
  onClose,
  onConfirm,
  title,
  reasons,
  confirmLabel,
  confirmMessage,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note: string) => void;
  title: string;
  reasons: string[];
  confirmLabel: string;
  confirmMessage: string;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState(false);

  const reset = () => {
    setReason(null);
    setNote('');
    setConfirming(false);
  };

  if (confirming) {
    return (
      <Modal open={open} onClose={() => { reset(); onClose(); }} title={confirmLabel}>
        <p className="text-[14px] text-ht-text-secondary">{confirmMessage}</p>
        <div className="mt-5 flex gap-3">
          <Button label="Cancel" variant="secondary" onClick={() => setConfirming(false)} />
          <Button
            label={confirmLabel}
            variant="destructive"
            onClick={() => {
              onConfirm(reason!, note);
              reset();
            }}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title={title}>
      <div className="flex flex-col gap-1">
        {reasons.map((r) => {
          const active = reason === r;
          return (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`flex items-center gap-2.5 rounded-ht-input px-3 py-3 text-left text-[14px] transition-colors ${active ? 'bg-ht-info-bg font-semibold text-ht-ocean' : 'text-ht-text'}`}
            >
              <span>{active ? '🔘' : '⚪'}</span>
              {r}
            </button>
          );
        })}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note for the customer (optional)"
        rows={3}
        className="mt-3 w-full rounded-ht-input border-[1.5px] border-ht-border p-3 text-[13px] text-ht-text outline-none placeholder:text-ht-text-secondary focus:border-ht-ocean"
      />
      <Button
        label={confirmLabel}
        variant="destructive"
        disabled={!reason}
        onClick={() => setConfirming(true)}
        className="mt-4"
      />
    </Modal>
  );
}

export const REJECT_REASONS = [
  'Fully booked for this delivery window',
  'Customer location out of service area',
  'Requested fabric/design not feasible',
  'Price mismatch with customer expectations',
  'Other',
];

export const CANCEL_REASONS = [
  'Customer requested cancellation',
  'Unable to source required fabric',
  'Scheduling conflict',
  'Payment not received',
  'Other',
];
