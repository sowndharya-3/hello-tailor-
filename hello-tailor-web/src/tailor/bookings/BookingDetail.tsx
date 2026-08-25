// Ported from hello-tailor-app/app/(tailor)/booking/[id].tsx.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard } from '../components/OrderDetailShared';
import { ReasonSheet, REJECT_REASONS } from '../components/ReasonSheet';

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const acceptBooking = useStore((s) => s.acceptBooking);
  const rejectBooking = useStore((s) => s.rejectBooking);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [result, setResult] = useState<'accepted' | 'rejected' | null>(null);
  const navigate = useNavigate();

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Booking" />
        <p className="mt-10 text-center text-[14px] text-ht-text-secondary">Booking not found.</p>
      </div>
    );
  }

  if (result === 'accepted') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">Booking Accepted!</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ht-text-secondary">{booking.customerName}'s order has been added to your active orders.</p>
        <Button label="View Order" onClick={() => navigate(`/tailor/order/${booking.id}`, { replace: true })} className="mt-6" />
        <Button label="Back to Bookings" variant="secondary" onClick={() => navigate('/tailor/bookings', { replace: true })} className="mt-3" />
      </div>
    );
  }
  if (result === 'rejected') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">❌</span>
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">Booking Rejected</h2>
        <p className="mt-2 text-[14px] text-ht-text-secondary">The customer has been notified of the rejection.</p>
        <Button label="Back to Bookings" onClick={() => navigate('/tailor/bookings', { replace: true })} className="mt-6" />
      </div>
    );
  }

  const isPending = booking.status === 'Requested';

  return (
    <div>
      <ScreenHeader title="Booking Request" right={!isPending ? <Badge label={booking.status} tone="info" /> : undefined} />
      <div className="flex flex-col gap-3 px-4 pb-28 pt-4 sm:px-6">
        <CustomerInfoCard order={booking} />
        <CustomerNotesCard notes={booking.notes} />
        <FinancialSummaryCard order={booking} />
        <MeasurementsPreviewCard order={booking} onOpen={() => navigate(`/tailor/order/${booking.id}/measurements`)} />
        <DesignPhotosPreviewCard order={booking} onOpen={() => navigate(`/tailor/order/${booking.id}/photos`)} />
        {!isPending && <Button label="View Full Order Details" onClick={() => navigate(`/tailor/order/${booking.id}`, { replace: true })} className="mt-2" />}
      </div>

      {isPending && (
        <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-ht-border bg-ht-bg p-4 sm:sticky sm:px-6">
          <Button label="Reject" variant="destructive" onClick={() => setRejectOpen(true)} className="flex-1" />
          <Button label="Accept Booking" onClick={() => { acceptBooking(booking.id); setResult('accepted'); }} className="flex-[2]" />
        </div>
      )}

      <ReasonSheet
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={(reason, note) => {
          rejectBooking(booking.id, reason, note);
          setRejectOpen(false);
          setResult('rejected');
        }}
        title="Reject Booking"
        reasons={REJECT_REASONS}
        confirmLabel="Reject"
        confirmMessage="This will reject the booking and notify the customer. This cannot be undone."
      />
    </div>
  );
}
