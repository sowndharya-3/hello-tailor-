// Ported from hello-tailor-app/app/(tailor)/order/[id].tsx. Status advance walks the shared
// BOOKING_STAGES list via advanceBookingStage(); 'Delivered' is the terminal success stage.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { BOOKING_STAGES } from '@/store/types';
import { BookingItemsCard, CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard } from '../components/OrderDetailShared';
import { StatusStepper } from '../components/StatusStepper';
import { ReasonSheet, CANCEL_REASONS } from '../components/ReasonSheet';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));
  const advanceBookingStage = useStore((s) => s.advanceBookingStage);
  const cancelBooking = useStore((s) => s.cancelBooking);
  const [cancelOpen, setCancelOpen] = useState(false);
  const navigate = useNavigate();

  if (!order) {
    return (
      <div>
        <ScreenHeader title="Order" />
        <p className="mt-10 text-center text-[14px] text-ht-text-secondary">Order not found.</p>
      </div>
    );
  }

  const isTerminal = order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Rejected';
  const stageIdx = BOOKING_STAGES.indexOf(order.status as (typeof BOOKING_STAGES)[number]);
  const nextStage = !isTerminal && stageIdx >= 0 && stageIdx < BOOKING_STAGES.length - 1 ? BOOKING_STAGES[stageIdx + 1] : null;

  return (
    <div>
      <ScreenHeader
        title={order.id}
        right={<Badge label={order.status} tone={order.status === 'Cancelled' ? 'error' : order.status === 'Delivered' ? 'success' : 'info'} />}
      />
      <div className="flex flex-col gap-3 px-4 pb-28 pt-4 sm:px-6">
        <CustomerInfoCard order={order} />
        <BookingItemsCard order={order} />
        <CustomerNotesCard notes={order.notes} />

        {order.status === 'Cancelled' && order.cancelReason && (
          <Card className="border border-[#F5C2C0] bg-[#FDECEA]">
            <p className="font-semibold text-ht-error">Cancellation Reason</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ht-text">{order.cancelReason}</p>
          </Card>
        )}

        {!isTerminal && (
          <div>
            <h2 className="mb-3 font-semibold text-ht-text">Order Progress</h2>
            <Card><StatusStepper current={order.status} /></Card>
          </div>
        )}

        <FinancialSummaryCard order={order} />
        <MeasurementsPreviewCard order={order} onOpen={() => navigate(`/tailor/order/${order.id}/measurements`)} />
        <DesignPhotosPreviewCard order={order} onOpen={() => navigate(`/tailor/order/${order.id}/photos`)} />

        {!isTerminal && (
          <button onClick={() => setCancelOpen(true)} className="py-3 text-center text-[13px] font-medium text-ht-error">
            Cancel this order
          </button>
        )}
      </div>

      {!isTerminal && nextStage && (
        <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-bg p-4 sm:sticky sm:px-6">
          <Button label={`Update Status: ${nextStage}`} onClick={() => advanceBookingStage(order.id, nextStage)} />
        </div>
      )}

      <ReasonSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={(reason, note) => {
          cancelBooking(order.id, note ? `${reason} — ${note}` : reason);
          setCancelOpen(false);
          navigate('/tailor/orders', { replace: true });
        }}
        title="Cancel Order"
        reasons={CANCEL_REASONS}
        confirmLabel="Cancel Order"
        confirmMessage="This will cancel the order and notify the customer. This cannot be undone."
      />
    </div>
  );
}
