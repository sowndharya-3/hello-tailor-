import { Link, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { BOOKING_STAGES } from '@/store/types';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { clsx } from '@/components/ui/clsx';
import ChatEntryButton from '@/chat/ChatEntryButton';

function timestampFor(historyStage: string, history: { stage: string; at: string }[]) {
  const entry = history.find((h) => h.stage === historyStage);
  if (!entry) return null;
  return new Date(entry.at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));
  const setQuoteStatus = useStore((s) => s.setQuoteStatus);
  const payAdvance = useStore((s) => s.payAdvance);

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Track Order" />
        <EmptyState icon="⚠️" title="Order Not Found" message="We couldn't find this order." />
      </div>
    );
  }

  const terminal = booking.status === 'Rejected' || booking.status === 'Cancelled';
  const currentIndex = terminal ? -1 : BOOKING_STAGES.indexOf(booking.status);
  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;
  const quoteTotal = booking.amount + booking.tax - booking.discount;

  return (
    <div>
      <ScreenHeader title="Track Order" subtitle={booking.id} />
      <div className="p-4 pb-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <img src={tailor?.image} alt="" className="h-12 w-12 rounded-ht-input object-cover" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ht-text">{tailor?.shopName ?? booking.tailorName}</p>
            <p className="text-[12px] text-ht-text-secondary">{booking.category}</p>
          </div>
          <Badge label={booking.status} tone={terminal ? 'error' : 'info'} />
        </div>

        <ChatEntryButton role="customer" booking={booking} />
        {booking.quoteStatus === 'Pending' && <div className="mb-4 rounded-ht-card border border-ht-ocean bg-ht-info-bg p-4"><p className="font-semibold text-ht-text">Awaiting Tailor Quotation</p><p className="mt-1 text-xs text-ht-text-secondary">No payment is due until the tailor reviews your request.</p></div>}
        {booking.quoteStatus && booking.quoteStatus !== 'Pending' && booking.quoteStatus !== 'Rejected' && <div className="mb-5 rounded-ht-card border border-ht-border bg-white p-4"><p className="mb-3 font-semibold text-ht-text">Tailor Quotation</p>{[
          ['Stitching', booking.stitchingCharge], ['Material', booking.materialCost], ['Pickup', booking.pickupFee], ['Delivery', booking.deliveryFee], ['Customization', booking.customizationCharge], ['Tax', booking.tax], ['Discount', booking.discount ? -booking.discount : 0],
        ].filter(([,value]) => Number(value) !== 0).map(([label,value]) => <div key={String(label)} className="flex justify-between py-1 text-sm"><span className="text-ht-text-secondary">{label}</span><span className="text-ht-text">₹{value}</span></div>)}<div className="mt-2 flex justify-between border-t border-ht-border pt-2 font-semibold"><span>Total</span><span>₹{quoteTotal}</span></div>{booking.tailorNotes && <p className="mt-3 rounded-ht-input bg-ht-info-bg p-3 text-xs text-ht-text-secondary">{booking.tailorNotes}</p>}{booking.quoteStatus === 'Sent' && <div className="mt-4 flex gap-2"><Button label="Request Changes" variant="secondary" onClick={() => setQuoteStatus(booking.id, 'Changes Requested')} className="flex-1" /><Button label="Accept Quote" onClick={() => setQuoteStatus(booking.id, 'Accepted')} className="flex-1" /></div>}{booking.quoteStatus === 'Accepted' && !booking.advancePaid && <Button label={`Pay 50% Advance ₹${booking.advanceAmount}`} onClick={() => payAdvance(booking.id)} className="mt-4" />}</div>}
        {terminal ? (
          <div className="flex flex-col items-center gap-1.5 rounded-ht-card border border-ht-border bg-ht-card p-6 text-center">
            <span className="text-3xl">{booking.status === 'Cancelled' ? '❌' : '🚫'}</span>
            <p className="text-[16px] font-semibold text-ht-text">Order {booking.status}</p>
            {(booking.cancelReason || booking.rejectReason) ? (
              <p className="text-[13px] text-ht-text-secondary">Reason: {booking.cancelReason ?? booking.rejectReason}</p>
            ) : null}
          </div>
        ) : (
          <div className="pl-1">
            {BOOKING_STAGES.map((stage, i) => {
              const done = i <= currentIndex;
              const isLast = i === BOOKING_STAGES.length - 1;
              const ts = timestampFor(stage, booking.history);
              return (
                <div key={stage} className="flex">
                  <div className="flex w-7 flex-col items-center">
                    <div className={clsx('flex h-5.5 w-5.5 items-center justify-center rounded-full', done ? 'bg-ht-success text-white' : 'bg-ht-disabled-bg')} style={{ width: 22, height: 22 }}>
                      {done ? '✓' : ''}
                    </div>
                    {!isLast ? <div className={clsx('mt-0.5 w-0.5 flex-1', done ? 'bg-ht-success' : 'bg-ht-disabled-bg')} /> : null}
                  </div>
                  <div className={clsx('flex-1 min-w-0', !isLast && 'pb-4.5')} style={{ paddingBottom: isLast ? 0 : 18 }}>
                    <p className={clsx('ml-2.5 text-[14px]', done ? 'font-semibold text-ht-text' : 'text-ht-text-secondary')}>{stage}</p>
                    <p className="ml-2.5 mt-0.5 text-[12px] text-ht-text-secondary">{ts ?? 'Pending'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex gap-2.5">
          {!terminal && !booking.balancePaid && balanceDue > 0 ? (
            <Link to={`/customer/order/${booking.id}/balance-payment`} className="flex-1"><Button label={`Pay Balance ₹${balanceDue}`} /></Link>
          ) : (
            <Link to={`/customer/order/${booking.id}/invoice`} className="flex-1"><Button label="View Invoice" variant="secondary" /></Link>
          )}
          <Link to={`/customer/order/${booking.id}/reorder`} className="flex-1"><Button label="Re-order" variant="secondary" /></Link>
        </div>
        <Link to={`/customer/profile/complaints/new?orderId=${booking.id}`} className="mt-4 flex items-center justify-center gap-1.5 text-[13px] font-medium text-ht-error">
          ⚠️ Report an issue with this order
        </Link>
      </div>
    </div>
  );
}
