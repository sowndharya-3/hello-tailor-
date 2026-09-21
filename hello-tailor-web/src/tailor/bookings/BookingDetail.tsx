// Ported from hello-tailor-app/app/(tailor)/booking/[id].tsx.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { BookingItemsCard, CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard } from '../components/OrderDetailShared';
import { ReasonSheet, REJECT_REASONS } from '../components/ReasonSheet';
import { colourLabel, itemTitle, materialLabel } from '@/lib/bookingItems';

const num = (value: string | undefined) => Math.max(0, Number(value) || 0);

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const sendQuotation = useStore((s) => s.sendQuotation);
  const rejectBooking = useStore((s) => s.rejectBooking);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [result, setResult] = useState<'accepted' | 'rejected' | null>(null);
  // Item-wise pricing: line totals (incl. quantity) per garment, keyed by item id.
  const [itemQuote, setItemQuote] = useState<Record<string, { stitching?: string; material?: string }>>({});
  const [quote, setQuote] = useState({ stitching: '450', material: '0', pickup: '0', delivery: '0', customization: '0', tax: '0', discount: '0', notes: '' });
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
        <h2 className="mt-4 text-[22px] font-semibold text-ht-text">Quotation Sent</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ht-text-secondary">{booking.customerName} can now review the itemised quotation and approve or request changes.</p>
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
  const items = booking.items ?? [];
  const itemised = items.length > 0; // bookings made with the garment flow are quoted per item
  const lineItems = items.map((item) => ({
    ...item,
    stitchingCharge: num(itemQuote[item.id]?.stitching ?? '450'),
    materialCost: num(itemQuote[item.id]?.material ?? '0'),
  }));
  const stitchingCharge = itemised ? lineItems.reduce((sum, i) => sum + i.stitchingCharge, 0) : num(quote.stitching);
  const materialCost = itemised ? lineItems.reduce((sum, i) => sum + i.materialCost, 0) : num(quote.material);
  const pickupFee = num(quote.pickup), deliveryFee = num(quote.delivery), customizationCharge = num(quote.customization);
  const tax = num(quote.tax), discount = num(quote.discount);
  const amount = stitchingCharge + materialCost + pickupFee + deliveryFee + customizationCharge;
  const quoteTotal = amount + tax - discount;

  return (
    <div>
      <ScreenHeader title="Booking Request" right={!isPending ? <Badge label={booking.status} tone="info" /> : undefined} />
      <div className="flex flex-col gap-3 px-4 pb-28 pt-4 sm:px-6">
        <CustomerInfoCard order={booking} />
        <BookingItemsCard order={booking} />
        <CustomerNotesCard notes={booking.notes} />
        {booking.quoteStatus === 'Sent' || booking.quoteStatus === 'Accepted' ? <FinancialSummaryCard order={booking} /> : null}
        <MeasurementsPreviewCard order={booking} onOpen={() => navigate(`/tailor/order/${booking.id}/measurements`)} />
        <DesignPhotosPreviewCard order={booking} onOpen={() => navigate(`/tailor/order/${booking.id}/photos`)} />
        {isPending && booking.quoteStatus !== 'Sent' && (
          <div className="rounded-ht-card border border-ht-border bg-white p-4">
            <p className="mb-1 font-semibold text-ht-text">Prepare Quotation</p>
            <p className="mb-3 text-xs text-ht-text-secondary">{itemised ? `Price each of the ${items.length} garment${items.length === 1 ? '' : 's'} below; the customer receives one combined quotation.` : 'Enter the charges for this request.'}</p>
            {itemised ? (
              <div className="mb-4 flex flex-col gap-3">
                {items.map((item, index) => (
                  <fieldset key={item.id} className="rounded-ht-input border border-ht-border p-3">
                    <legend className="px-1 text-[13px] font-semibold text-ht-text">Item {index + 1} – {itemTitle(item)}</legend>
                    <p className="mb-2 text-[11px] text-ht-text-secondary">Qty {item.quantity} · {materialLabel(item)} · {colourLabel(item)} · {item.customerProvidedCloth ? 'customer provides cloth' : 'tailor provides cloth'}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs text-ht-text-secondary">Stitching (₹)<input type="number" min="0" inputMode="decimal" value={itemQuote[item.id]?.stitching ?? '450'} onChange={(e) => setItemQuote({ ...itemQuote, [item.id]: { ...itemQuote[item.id], stitching: e.target.value } })} className="mt-1 h-11 w-full rounded-ht-input border border-ht-border px-3 text-sm text-ht-text" /></label>
                      <label className="text-xs text-ht-text-secondary">Material (₹)<input type="number" min="0" inputMode="decimal" value={itemQuote[item.id]?.material ?? '0'} onChange={(e) => setItemQuote({ ...itemQuote, [item.id]: { ...itemQuote[item.id], material: e.target.value } })} className="mt-1 h-11 w-full rounded-ht-input border border-ht-border px-3 text-sm text-ht-text" /></label>
                    </div>
                  </fieldset>
                ))}
              </div>
            ) : null}
            {itemised && <p className="mb-2 text-[13px] font-semibold text-ht-text">Additional charges</p>}
            <div className="grid grid-cols-2 gap-3">
              {[...(itemised ? [] : [['stitching', 'Stitching charge'], ['material', 'Material cost']]), ['pickup', 'Pickup fee'], ['delivery', 'Delivery fee'], ['customization', 'Customization'], ['tax', 'Tax'], ['discount', 'Discount']].map(([key, label]) => (
                <label key={key} className="text-xs text-ht-text-secondary">{label}<input type="number" min="0" inputMode="decimal" value={quote[key as keyof typeof quote]} onChange={(e) => setQuote({ ...quote, [key]: e.target.value })} className="mt-1 h-11 w-full rounded-ht-input border border-ht-border px-3 text-sm text-ht-text" /></label>
              ))}
            </div>
            <label className="mt-3 block text-xs text-ht-text-secondary">Tailor notes<textarea value={quote.notes} onChange={(e) => setQuote({ ...quote, notes: e.target.value })} className="mt-1 min-h-20 w-full rounded-ht-input border border-ht-border p-3 text-sm text-ht-text" /></label>
            <div className="mt-4 flex items-center justify-between rounded-ht-input bg-ht-info-bg px-4 py-3">
              <span className="text-sm font-semibold text-ht-text">Total quotation</span>
              <span className="text-lg font-bold text-ht-navy">₹{quoteTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
        {!isPending && <Button label="View Full Order Details" onClick={() => navigate(`/tailor/order/${booking.id}`, { replace: true })} className="mt-2" />}
      </div>

      {isPending && (
        <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-ht-border bg-ht-bg p-4 sm:sticky sm:px-6">
          <Button label="Reject" variant="destructive" onClick={() => setRejectOpen(true)} className="flex-1" />
          <Button label="Send Quotation" disabled={quoteTotal <= 0} onClick={() => { sendQuotation(booking.id, { stitchingCharge, materialCost, pickupFee, deliveryFee, customizationCharge, tax, discount, amount, advanceAmount: Math.ceil((amount + tax - discount) / 2), tailorNotes: quote.notes, ...(itemised ? { items: lineItems } : {}) }); setResult('accepted'); }} className="flex-[2]" />
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
