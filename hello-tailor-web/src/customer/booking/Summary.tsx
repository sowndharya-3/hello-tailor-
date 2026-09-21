import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import BookingItemsList from '@/components/BookingItemsList';
import { itemTitle, personNameFor, validateItem } from '@/lib/bookingItems';

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-ht-ocean">{icon}</span>
      <div className="flex-1">
        <p className="text-[12px] text-ht-text-secondary">{label}</p>
        <p className="mt-0.5 text-[14px] font-medium text-ht-text">{value}</p>
      </div>
    </div>
  );
}

export default function Summary() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const removeDraftItem = useStore((s) => s.removeDraftItem);
  const tailors = useStore((s) => s.tailors);
  const family = useStore((s) => s.family);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const items = booking.items ?? [];
  const [showErrors, setShowErrors] = useState(false);
  // Validate every garment independently; the request can only be submitted when all are complete.
  const problems = items.flatMap((item, index) => { const missing = validateItem(item); return missing.length ? [`Item ${index + 1} (${itemTitle(item)}): ${missing.join(', ')}`] : []; });
  const canSubmit = items.length > 0 && problems.length === 0;
  const submit = () => {
    if (!canSubmit) { setShowErrors(true); return; }
    navigate(`/customer/booking/${tailorId}/processing`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Stitching Request" subtitle="Review before submitting" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={10} total={11} label="Summary" /></div>
      <div className="p-4 sm:px-6">
        <div className="mb-5 flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <img src={tailor.image} alt="" className="h-12 w-12 rounded-ht-input object-cover" />
          <div>
            <p className="text-[15px] font-semibold text-ht-text">{tailor.shopName}</p>
            <p className="text-[12px] text-ht-text-secondary">{tailor.name}</p>
          </div>
        </div>

        <h2 className="mb-2.5 text-[15px] font-semibold text-ht-text">Garments ({items.length})</h2>
        <div className="mb-3">
          <BookingItemsList items={items} onRemove={removeDraftItem} personName={(i) => personNameFor(i, family, ME_CUSTOMER.name)} />
        </div>
        <Button label="+ Add Another Garment" variant="secondary" onClick={() => navigate(`/customer/booking/${tailorId}/gender`, { state: { addAnother: true } })} className="mb-5" />

        {showErrors && problems.length > 0 && (
          <div role="alert" className="mb-5 rounded-ht-card border border-ht-error bg-ht-error/5 p-4">
            <p className="font-semibold text-ht-error">Please complete every garment before submitting</p>
            <ul className="mt-2 list-disc pl-5 text-[13px] text-ht-text">{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
          </div>
        )}
        {showErrors && items.length === 0 && <p role="alert" className="mb-5 text-[13px] font-medium text-ht-error">Add at least one garment to submit this booking.</p>}

        <div className="mb-5 flex flex-col gap-3.5">
          <Row icon="📅" label="Booking Date" value={booking.bookingDate ?? '—'} />
          <Row icon="📦" label="Estimated Delivery" value={booking.deliveryDate ?? '—'} />
          <Row icon="🚲" label="Cloth Pickup" value={booking.customerProvidedCloth ? `${booking.method} · ${booking.timeSlot ?? ''}` : 'Not required'} />
          <Row icon="📦" label="Final Delivery" value={booking.deliveryMethod ?? 'Self Pickup'} />
          {booking.notes ? <Row icon="💬" label="Notes" value={booking.notes} /> : null}
        </div>

        <div className="rounded-ht-card border border-ht-ocean bg-ht-info-bg p-4"><p className="text-sm text-ht-text-secondary">Pricing Status</p><p className="mt-1 font-semibold text-ht-ocean">Awaiting Tailor Quotation</p><p className="mt-2 text-xs text-ht-text-secondary">The tailor will review every garment's stitching, material and pickup requirements and send one combined, item-wise quotation.</p></div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label={items.length > 1 ? `Submit Request (${items.length} garments)` : 'Submit Stitching Request'} onClick={submit} />
      </div>
    </div>
  );
}
