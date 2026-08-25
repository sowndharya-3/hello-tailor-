import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { clothTypesByCategory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const COLOURS = [
  { name: 'Navy', hex: '#173B57' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#E8DCC4' },
  { name: 'Maroon', hex: '#7A1F2B' }, { name: 'Black', hex: '#1A1A1A' }, { name: 'Sky Blue', hex: '#8FC5E8' },
];

export default function ClothDetails() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const clothOptions = clothTypesByCategory[booking.category ?? 'Men'] ?? ['Cotton'];

  const [clothType, setClothType] = useState(clothOptions[0]);
  const [colour, setColour] = useState(COLOURS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [provided, setProvided] = useState(true);
  const [notes, setNotes] = useState('');

  const submit = () => {
    updateBooking({ clothType, colour, quantity, customerProvidedCloth: provided, clothNotes: notes });
    navigate(`/customer/booking/${tailorId}/design-upload`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Cloth Details" subtitle={booking.category} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={3} total={11} label="Cloth Details" /></div>
      <div className="flex flex-col gap-5 p-4 sm:px-6">
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Cloth Type / Material</p>
          <div className="flex flex-wrap gap-2">
            {clothOptions.map((c) => (
              <button key={c} onClick={() => setClothType(c)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', clothType === c ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Colour</p>
          <div className="flex flex-wrap gap-2">
            {COLOURS.map((c) => (
              <button key={c.name} onClick={() => setColour(c.name)} className={clsx('flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium', colour === c.name ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>
                <span className="h-4 w-4 rounded-full border border-ht-border" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Quantity</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-disabled-bg">−</button>
            <span className="min-w-6 text-center text-[17px] font-semibold text-ht-text">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-disabled-bg">+</button>
          </div>
        </div>
        <button onClick={() => setProvided((v) => !v)} className="flex items-center gap-3 text-left">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-ht-text">I will provide the cloth</p>
            <p className="text-[12px] text-ht-text-secondary">Turn off if you'd like the tailor to source the fabric for you</p>
          </div>
          <span className="text-2xl">{provided ? '🟢' : '⚪'}</span>
        </button>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Notes <span className="font-normal text-ht-text-secondary">(optional)</span></p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions for the cloth..." className="min-h-[90px] w-full rounded-ht-input border-[1.5px] border-ht-border p-3 text-[14px] text-ht-text outline-none" />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} />
      </div>
    </div>
  );
}
