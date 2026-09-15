import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';

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
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const personName = booking.personId === 'self' ? 'Myself' : family.find((f) => f.id === booking.personId)?.name ?? ME_CUSTOMER.name;
  const measurement = measurements.find((m) => m.id === booking.measurementId);

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

        <div className="mb-5 flex flex-col gap-3.5">
          <Row icon="👕" label="Gender / Garment" value={`${booking.gender} · ${booking.category} · ${booking.service}`} />
          <Row icon="👤" label="For" value={personName} />
          <Row icon="📏" label="Measurement" value={measurement?.label ?? 'Not selected'} />
          <Row icon="🧵" label="Cloth Provider" value={booking.customerProvidedCloth ? 'Customer will provide the cloth' : 'Tailor will provide the cloth'} />
          <Row icon="🎨" label="Material Preference" value={`${booking.clothType ?? 'Not specified'} · ${booking.colour ?? 'Not specified'}`} />
          <Row icon="🖼️" label="Design Photos" value={`${booking.designPhotos?.length ?? 0} photo(s) attached`} />
          <Row icon="📅" label="Booking Date" value={booking.bookingDate ?? '—'} />
          <Row icon="📦" label="Estimated Delivery" value={booking.deliveryDate ?? '—'} />
          <Row icon="🚲" label="Cloth Pickup" value={booking.customerProvidedCloth ? `${booking.method} · ${booking.timeSlot ?? ''}` : 'Not required'} />
          <Row icon="📦" label="Final Delivery" value={booking.deliveryMethod ?? 'Self Pickup'} />
          {booking.notes ? <Row icon="💬" label="Notes" value={booking.notes} /> : null}
        </div>

        <div className="rounded-ht-card border border-ht-ocean bg-ht-info-bg p-4"><p className="text-sm text-ht-text-secondary">Pricing Status</p><p className="mt-1 font-semibold text-ht-ocean">Awaiting Tailor Quotation</p><p className="mt-2 text-xs text-ht-text-secondary">The tailor will review the stitching, material and pickup requirements before sending the final price.</p></div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Submit Stitching Request" onClick={() => navigate(`/customer/booking/${tailorId}/processing`)} />
      </div>
    </div>
  );
}
