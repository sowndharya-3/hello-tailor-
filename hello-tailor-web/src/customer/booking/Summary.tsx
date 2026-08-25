import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { computePricing } from './pricing';

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
  const measurements = useStore((s) => s.measurements);
  const tailors = useStore((s) => s.tailors);
  const family = useStore((s) => s.family);
  const coupons = useStore((s) => s.coupons);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const personName = booking.personId === 'self' ? 'Myself' : family.find((f) => f.id === booking.personId)?.name ?? ME_CUSTOMER.name;
  const measurement = measurements.find((m) => m.id === booking.measurementId);
  const pricing = computePricing(booking, tailor, coupons);

  return (
    <div className="pb-24">
      <ScreenHeader title="Booking Summary" subtitle="Review before you pay" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={10} total={11} label="Summary" /></div>
      <div className="p-4 sm:px-6">
        <div className="mb-5 flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <img src={tailor.image} alt="" className="h-12 w-12 rounded-ht-input object-cover" />
          <div>
            <p className="text-[15px] font-semibold text-ht-text">{tailor.shopName}</p>
            <p className="text-[12px] text-ht-text-secondary">{tailor.name}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3.5">
          <Row icon="👕" label="Garment" value={`${booking.category} • ${booking.clothType}, ${booking.colour} × ${booking.quantity}`} />
          <Row icon="👤" label="For" value={personName} />
          <Row icon="📏" label="Measurement" value={measurement?.label ?? 'Not selected'} />
          <Row icon="🖼️" label="Design Photos" value={`${booking.designPhotos?.length ?? 0} photo(s) attached`} />
          <Row icon="📅" label="Booking Date" value={booking.bookingDate ?? '—'} />
          <Row icon="📦" label="Estimated Delivery" value={booking.deliveryDate ?? '—'} />
          <Row icon="🚲" label="Pickup / Delivery" value={`${booking.method} • ${booking.timeSlot}`} />
          {booking.notes ? <Row icon="💬" label="Notes" value={booking.notes} /> : null}
        </div>

        <div className="rounded-ht-card border border-ht-border bg-ht-card p-4">
          <p className="mb-2.5 text-[16px] font-semibold text-ht-text">Price Details</p>
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Order Amount</span><span className="text-[14px] text-ht-text">₹{pricing.orderAmount}</span></div>
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Delivery Fee</span><span className="text-[14px] text-ht-text">{pricing.deliveryFee ? `₹${pricing.deliveryFee}` : 'Free'}</span></div>
          <div className="flex justify-between py-1"><span className="text-[14px] text-ht-text-secondary">Tax (5%)</span><span className="text-[14px] text-ht-text">₹{pricing.tax}</span></div>
          <div className="mt-1 flex justify-between border-t border-ht-border pt-2"><span className="text-[15px] font-semibold text-ht-text">Total Payable</span><span className="text-[15px] font-semibold text-ht-navy">₹{pricing.total}</span></div>
          <div className="mt-2.5 rounded-ht-input bg-ht-gold-light p-2.5 text-center text-[13px] font-medium text-ht-gold">
            Pay ₹{pricing.advance} now (advance) · ₹{pricing.balance} on delivery
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Proceed to Payment" onClick={() => navigate(`/customer/booking/${tailorId}/payment`)} />
      </div>
    </div>
  );
}
