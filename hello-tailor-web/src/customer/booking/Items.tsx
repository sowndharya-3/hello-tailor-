// "Your Garments" — shown after each garment is added. The customer can add as many more garments
// (of any gender the tailor supports) as they like under this one tailor booking, or continue on to
// scheduling once every garment is complete. One booking, one quotation, one advance payment.
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import BookingItemsList from '@/components/BookingItemsList';
import { personNameFor, validateItem } from '@/lib/bookingItems';

export default function BookingItems() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const items = useStore((s) => s.booking.items) ?? [];
  const family = useStore((s) => s.family);
  const removeDraftItem = useStore((s) => s.removeDraftItem);
  const tailor = useStore((s) => s.tailors.find((t) => t.id === tailorId));
  const allValid = items.length > 0 && items.every((i) => validateItem(i).length === 0);

  const addAnother = () => navigate(`/customer/booking/${tailorId}/gender`, { state: { addAnother: true } });

  return (
    <div className="pb-48">
      <ScreenHeader title="Your Garments" subtitle={tailor?.shopName} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={6} total={11} label="Garments" /></div>
      <div className="p-4 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-ht-card border border-ht-border bg-ht-card p-6 text-center">
            <p className="font-semibold text-ht-text">No garments added yet</p>
            <p className="mt-1 text-sm text-ht-text-secondary">Add at least one garment to continue with this booking.</p>
            <Link to={`/customer/booking/${tailorId}/gender`} className="mt-4 inline-block font-semibold text-ht-ocean">Add a garment</Link>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[13px] text-ht-text-secondary">
              {items.length} garment{items.length === 1 ? '' : 's'} in this booking. Each has its own measurements, material and colour — you can mix men's, women's and kids' garments.
            </p>
            <BookingItemsList items={items} onRemove={removeDraftItem} personName={(i) => personNameFor(i, family, ME_CUSTOMER.name)} />
          </>
        )}
      </div>
      <div className="booking-cta flex flex-col gap-2.5">
        <Button label="+ Add Another Garment" variant="secondary" onClick={addAnother} />
        <Button label={`Continue with ${items.length || 'no'} garment${items.length === 1 ? '' : 's'}`} disabled={!allValid} onClick={() => navigate(`/customer/booking/${tailorId}/date`)} />
      </div>
    </div>
  );
}
