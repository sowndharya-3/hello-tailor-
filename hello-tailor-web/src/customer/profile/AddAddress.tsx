import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const LABELS = ['Home', 'Work', 'Other'] as const;

export default function AddAddress() {
  const navigate = useNavigate();
  const addAddress = useStore((s) => s.addAddress);
  const [label, setLabel] = useState<(typeof LABELS)[number]>('Home');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [located, setLocated] = useState(false);

  const canSave = address.trim().length > 5 && pincode.length === 6;

  return (
    <div>
      <ScreenHeader title="Add Address" />
      <div className="p-4 sm:px-6">
        <p className="mb-2 text-[14px] font-medium text-ht-text">Label</p>
        <div className="mb-4 flex gap-2">
          {LABELS.map((l) => (
            <button key={l} onClick={() => setLabel(l)} className={clsx('rounded-full border px-4 py-2.5 text-[13px] font-medium', label === l ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{l}</button>
          ))}
        </div>

        <button onClick={() => setLocated(true)} className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ht-ocean">
          📍 {located ? 'Location Captured' : 'Use Current Location'}
        </button>

        <div className="mb-5 flex h-32 flex-col items-center justify-center gap-1.5 rounded-ht-card bg-ht-info-bg text-ht-ocean">
          🗺️ <span className="text-[13px]">Tap on the map to pin your exact address</span>
        </div>

        <Input label="Address" placeholder="Flat / Building / Street" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Landmark" optional placeholder="Nearby landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
        <Input label="Pincode" placeholder="600040" inputMode="numeric" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} />

        <Button
          label="Save Address"
          disabled={!canSave}
          onClick={() => { addAddress({ id: `a-${Date.now()}`, label, address, landmark, city, state, pincode, isDefault: false }); navigate(-1); }}
          className="mt-2"
        />
      </div>
    </div>
  );
}
