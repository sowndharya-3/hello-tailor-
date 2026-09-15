import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const BY_GENDER: Record<string, string[]> = {
  Men: ['Shirt', 'Pant', 'Kurta', 'Suit', 'Blazer', 'Waistcoat', 'Sherwani', 'Alteration'],
  Women: ['Blouse', 'Churidar', 'Salwar', 'Kurti', 'Saree Blouse', 'Lehenga', 'Gown', 'Skirt', 'Pant', 'Dress', 'Alteration'],
  Kids: ['Shirt', 'Pant', 'Frock', 'Kurta', 'Traditional Wear', 'School Uniform', 'Alteration'],
};

export default function BookingCategory() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const tailors = useStore((s) => s.tailors);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const [garment, setGarment] = useState(booking.category ?? '');
  const services = useMemo(() => tailor.services.filter((service) => (BY_GENDER[booking.gender ?? 'Men'] ?? []).some((name) => service.name.toLowerCase().includes(name.toLowerCase()))), [booking.gender, tailor.services]);
  const garments = [...new Set(services.map((service) => service.name.replace(/\s*(stitching|\(2pc\)).*$/i, '').trim()))];
  const service = services.find((item) => item.name.toLowerCase().includes(garment.toLowerCase()))?.name ?? '';

  return (
    <div className="pb-28">
      <ScreenHeader title="Select Garment" subtitle={`${booking.gender ?? ''} · ${tailor.shopName}`} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={2} total={10} label="Garment & service" /></div>
      <div className="flex items-center gap-2.5 px-4 pb-2 sm:px-6">
        <img src={tailor.image} alt="" className="h-10 w-10 rounded-ht-input object-cover" />
        <div>
          <p className="text-[14px] font-semibold text-ht-text">{tailor.shopName}</p>
          <p className="text-[12px] text-ht-text-secondary">Who's stitching: {tailor.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 p-4 sm:grid-cols-4 sm:px-6 lg:grid-cols-6">
        {garments.map((name) => (
          <button
            key={name}
            onClick={() => setGarment(name)}
            className={clsx('flex min-h-28 flex-col items-center justify-center gap-2 rounded-ht-card border', garment === name ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card')}
          >
            <span className="text-2xl">🧵</span>
            <span className="text-[13px] font-medium text-ht-text">{name}</span>
          </button>
        ))}
      </div>
      {garment && <div className="mx-4 rounded-ht-card border border-ht-ocean bg-ht-info-bg p-4 sm:mx-6"><p className="text-xs text-ht-text-secondary">Required service</p><p className="mt-1 font-semibold text-ht-text">{service || `${garment} Stitching`}</p></div>}
      {!garments.length && <p className="mx-4 rounded-ht-card bg-ht-info-bg p-4 text-sm text-ht-text-secondary sm:mx-6">This tailor has no configured {booking.gender?.toLowerCase()} garment services.</p>}
      <div className="booking-cta"><Button label="Continue" disabled={!garment} onClick={() => { updateBooking({ category: garment, service: service || `${garment} Stitching` }); navigate(`/customer/booking/${tailor.id}/person`); }} /></div>
    </div>
  );
}
