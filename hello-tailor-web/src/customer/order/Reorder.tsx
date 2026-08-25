import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function Reorder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));
  const resetBooking = useStore((s) => s.resetBooking);
  const updateBooking = useStore((s) => s.updateBooking);
  const [confirming, setConfirming] = useState(false);

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Re-order" />
        <EmptyState icon="⚠️" title="Order Not Found" message="We couldn't find this order." />
      </div>
    );
  }

  const proceed = () => {
    resetBooking();
    updateBooking({ tailorId: booking.tailorId, category: booking.category, personId: 'self' });
    navigate(`/customer/booking/${booking.tailorId}/cloth-details`, { replace: true });
  };

  return (
    <div>
      <ScreenHeader title="Re-order" subtitle={booking.id} />
      <div className="p-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <img src={tailor?.image} alt="" className="h-13 w-13 rounded-ht-input object-cover" style={{ width: 52, height: 52 }} />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ht-text">{tailor?.shopName ?? booking.tailorName}</p>
            <p className="text-[12px] text-ht-text-secondary">{booking.category} • Same measurement & design will be prefilled</p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 rounded-ht-input bg-ht-info-bg p-3">
          <span className="text-ht-ocean">ℹ️</span>
          <p className="flex-1 text-[13px] text-ht-ocean">We'll prefill the tailor, category, saved measurement and design references from this order. You can review and edit everything before confirming.</p>
        </div>

        {!confirming ? (
          <div className="mt-5"><Button label="Re-order with Same Details" onClick={() => setConfirming(true)} /></div>
        ) : (
          <div className="mt-5 rounded-ht-card border border-ht-border bg-ht-card p-4">
            <p className="text-[16px] font-semibold text-ht-text">Confirm Re-order?</p>
            <p className="mt-1 text-[13px] text-ht-text-secondary">You'll be taken through the booking flow with your previous choices prefilled.</p>
            <div className="mt-3 flex gap-2.5">
              <Button label="Cancel" variant="secondary" onClick={() => setConfirming(false)} />
              <Button label="Confirm" onClick={proceed} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
