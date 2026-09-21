import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { clothTypesByCategory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';
import { OTHER } from '@/lib/bookingItems';

const COLOURS = [
  { name: 'Navy', hex: '#173B57' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#E8DCC4' },
  { name: 'Maroon', hex: '#7A1F2B' }, { name: 'Black', hex: '#1A1A1A' }, { name: 'Sky Blue', hex: '#8FC5E8' },
];

export default function ClothDetails() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const clothOptions = [...(clothTypesByCategory[booking.category ?? 'Men'] ?? ['Cotton']), OTHER];

  const [clothType, setClothType] = useState(clothOptions[0]);
  const [customMaterial, setCustomMaterial] = useState('');
  const [colour, setColour] = useState(COLOURS[0].name);
  const [customColour, setCustomColour] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [provided, setProvided] = useState(true);
  const [notes, setNotes] = useState('');

  // "Other" needs its typed value before the item can move on (each garment keeps its own).
  const materialMissing = clothType === OTHER && !customMaterial.trim();
  const colourMissing = colour === OTHER && !customColour.trim();

  const submit = () => {
    if (materialMissing || colourMissing) return;
    updateBooking({
      clothType, customMaterial: clothType === OTHER ? customMaterial.trim() : undefined,
      colour, customColour: colour === OTHER ? customColour.trim() : undefined,
      quantity, customerProvidedCloth: provided, clothNotes: notes,
    });
    navigate(`/customer/booking/${tailorId}/design-upload`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Cloth / Material" subtitle={[booking.gender, booking.category].filter(Boolean).join(' · ')} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={3} total={11} label="Cloth Details" /></div>
      <div className="flex flex-col gap-5 p-4 sm:px-6">
        <div>
          <p className="mb-2.5 text-[14px] font-semibold text-ht-text">Who will provide the cloth/material?</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setProvided(true)} className={clsx('rounded-ht-card border p-4 text-left', provided ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-white')}><span className="font-semibold text-ht-text">I will provide</span><span className="mt-1 block text-xs text-ht-text-secondary">Choose drop-off or tailor pickup</span></button>
            <button onClick={() => setProvided(false)} className={clsx('rounded-ht-card border p-4 text-left', !provided ? 'border-ht-ocean bg-ht-info-bg' : 'border-ht-border bg-white')}><span className="font-semibold text-ht-text">Tailor will provide</span><span className="mt-1 block text-xs text-ht-text-secondary">Price confirmed in quotation</span></button>
          </div>
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">{provided ? 'Material Type' : 'Preferred Material'}</p>
          <div className="flex flex-wrap gap-2">
            {clothOptions.map((c) => (
              <button key={c} onClick={() => setClothType(c)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', clothType === c ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c}</button>
            ))}
          </div>
          {clothType === OTHER && (
            <label className="mt-3 block text-[13px] font-medium text-ht-text">Enter material type <span className="text-ht-error">*</span>
              <input value={customMaterial} maxLength={40} onChange={(e) => setCustomMaterial(e.target.value)} placeholder="e.g. Linen, Denim, Velvet, Handloom" aria-invalid={materialMissing}
                className={clsx('mt-1.5 w-full rounded-ht-input border-[1.5px] px-3.5 text-[14px] font-normal text-ht-text outline-none', materialMissing ? 'border-ht-error' : 'border-ht-border')} style={{ height: 50 }} />
              {materialMissing && <span className="mt-1 block text-xs font-normal text-ht-error">Please enter the material you need.</span>}
            </label>
          )}
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">{provided ? 'Colour' : 'Preferred Colour'}</p>
          <div className="flex flex-wrap gap-2">
            {COLOURS.map((c) => (
              <button key={c.name} onClick={() => setColour(c.name)} className={clsx('flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium', colour === c.name ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>
                <span className="h-4 w-4 rounded-full border border-ht-border" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            ))}
            <button onClick={() => setColour(OTHER)} className={clsx('flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium', colour === OTHER ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>
              <span className="h-4 w-4 rounded-full border border-dashed border-ht-text-secondary" />
              {OTHER}
            </button>
          </div>
          {colour === OTHER && (
            <label className="mt-3 block text-[13px] font-medium text-ht-text">Enter colour <span className="text-ht-error">*</span>
              <input value={customColour} maxLength={40} onChange={(e) => setCustomColour(e.target.value)} placeholder="e.g. Olive Green, Wine Red, Peach" aria-invalid={colourMissing}
                className={clsx('mt-1.5 w-full rounded-ht-input border-[1.5px] px-3.5 text-[14px] font-normal text-ht-text outline-none', colourMissing ? 'border-ht-error' : 'border-ht-border')} style={{ height: 50 }} />
              {colourMissing && <span className="mt-1 block text-xs font-normal text-ht-error">Please enter the colour you need.</span>}
            </label>
          )}
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Quantity</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-disabled-bg">−</button>
            <span className="min-w-6 text-center text-[17px] font-semibold text-ht-text">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-ht-disabled-bg">+</button>
          </div>
        </div>
        <div>
          <p className="mb-2.5 text-[14px] font-medium text-ht-text">Notes <span className="font-normal text-ht-text-secondary">(optional)</span></p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={provided ? 'Any special instructions for the cloth...' : 'Pattern, style and budget preference...'} className="min-h-[90px] w-full rounded-ht-input border-[1.5px] border-ht-border p-3 text-[14px] text-ht-text outline-none" />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} disabled={materialMissing || colourMissing} />
      </div>
    </div>
  );
}
