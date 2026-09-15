import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const METHODS: { id: Booking['pickupType']; icon: string; desc: string; fee: number }[] = [
  { id: 'Self Drop', icon: '🚶', desc: "Drop off the cloth at the tailor's shop yourself", fee: 0 },
  { id: 'Tailor Pickup', icon: '🚲', desc: 'Tailor picks up the cloth from your address', fee: 49 },
];

const SLOTS = ['9:00 AM – 12:00 PM', '12:00 PM – 3:00 PM', '3:00 PM – 6:00 PM', '6:00 PM – 9:00 PM'];

export default function Method() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const updateBooking = useStore((s) => s.updateBooking);
  const booking = useStore((s) => s.booking);
  const addresses = useStore((s) => s.addresses);
  const [method, setMethod] = useState<Booking['pickupType']>('Self Drop');
  const [slot, setSlot] = useState(SLOTS[0]);
  const [deliveryMethod, setDeliveryMethod] = useState<'Self Pickup' | 'Home Delivery'>(booking.deliveryMethod ?? 'Self Pickup');
  const needsAddress = method === 'Tailor Pickup' || deliveryMethod === 'Home Delivery';
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const submit = () => {
    updateBooking({ method: booking.customerProvidedCloth ? method : undefined, deliveryMethod, timeSlot: booking.customerProvidedCloth && method === 'Tailor Pickup' ? slot : undefined, addressId: needsAddress ? defaultAddress?.id : undefined });
    navigate(`/customer/booking/${tailorId}/notes`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Pickup & Delivery" subtitle="Cloth pickup and finished delivery" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={8} total={11} label="Method" /></div>
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {booking.customerProvidedCloth && <p className="text-[14px] font-semibold text-ht-text">How will the cloth reach the tailor?</p>}
        {booking.customerProvidedCloth && METHODS.map((m) => {
          const active = method === m.id;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} className={clsx('flex items-center gap-3 rounded-ht-card border-[1.5px] p-4 text-left', active ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-ht-card')}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ht-card text-xl">{m.icon}</div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ht-text">{m.id}</p>
                <p className="mt-0.5 text-[12px] text-ht-text-secondary">{m.desc}</p>
                <p className="mt-1 text-[12px] font-medium text-ht-navy">{m.fee ? `₹${m.fee} fee` : 'Free'}</p>
              </div>
              <span>{active ? '🔵' : '⚪'}</span>
            </button>
          );
        })}

        {needsAddress ? (
          <div className="rounded-ht-card bg-ht-info-bg p-4">
            <p className="mb-2 text-[14px] font-medium text-ht-text">Address</p>
            <p className="text-[14px] text-ht-text-secondary">{defaultAddress?.label} — {defaultAddress?.address}, {defaultAddress?.city}</p>
          </div>
        ) : null}

        {booking.customerProvidedCloth && method === 'Tailor Pickup' && <><p className="mt-1 text-[14px] font-medium text-ht-text">Preferred cloth pickup time</p>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <button key={s} onClick={() => setSlot(s)} className={clsx('rounded-full border px-3 py-2.5 text-[13px]', slot === s ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{s}</button>
          ))}
        </div></>}
        <p className="mt-3 text-[14px] font-semibold text-ht-text">How should the finished garment be delivered?</p>
        <div className="grid grid-cols-2 gap-3">{(['Self Pickup', 'Home Delivery'] as const).map((option) => <button key={option} onClick={() => setDeliveryMethod(option)} className={clsx('rounded-ht-card border p-4 text-left', deliveryMethod === option ? 'border-ht-ocean bg-ht-info-bg text-ht-ocean' : 'border-ht-border bg-white text-ht-text')}><span className="font-semibold">{option}</span><span className="mt-1 block text-xs text-ht-text-secondary">{option === 'Self Pickup' ? 'Collect at tailor shop · Free' : 'Deliver to your address · Fee in quote'}</span></button>)}</div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} />
      </div>
    </div>
  );
}
