import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { categorySummary } from '@/lib/bookingItems';

export default function DeliveryDate() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const tailors = useStore((s) => s.tailors);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];

  const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : new Date();
  const estimated = new Date(bookingDate);
  estimated.setDate(estimated.getDate() + tailor.deliveryDays);
  const estimatedStr = estimated.toDateString();

  const submit = () => {
    updateBooking({ deliveryDate: estimatedStr });
    navigate(`/customer/booking/${tailorId}/method`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Delivery Date" subtitle="Auto-estimated based on tailor workload" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={7} total={11} label="Delivery Date" /></div>
      <div className="p-4 sm:px-6">
        <div className="flex flex-col items-center gap-1.5 rounded-ht-card bg-ht-info-bg py-8">
          <span className="text-3xl">📦</span>
          <p className="mt-1.5 text-[13px] text-ht-text-secondary">Estimated Delivery</p>
          <p className="text-[22px] font-semibold text-ht-navy">{estimatedStr}</p>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <p className="mb-1 text-[16px] font-semibold text-ht-text">Why this date?</p>
          <div className="flex items-start gap-2">
            <span className="text-ht-success">✔️</span>
            <p className="flex-1 text-[14px] text-ht-text-secondary">{tailor.shopName} typically delivers {booking.items?.length ? categorySummary(booking.items) : booking.category} orders in {tailor.deliveryDays} days</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-ht-success">✔️</span>
            <p className="flex-1 text-[14px] text-ht-text-secondary">Booking date: {booking.bookingDate}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-ht-ocean">ℹ️</span>
            <p className="flex-1 text-[14px] text-ht-text-secondary">Dates earlier than the estimate aren't possible — the tailor needs this much time to stitch and quality-check your order.</p>
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} />
      </div>
    </div>
  );
}
