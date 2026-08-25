// Ported from hello-tailor-app/components/tailor/LocationEditor.tsx. address/landmark/pincode
// are NOT on the shared Tailor type (only city/state/locality are) — callers keep this value
// as local screen state and persist only the overlapping fields to the store.
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface LocationValue {
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

const SUGGESTIONS = ['MG Road, Bengaluru', 'Indiranagar, Bengaluru', 'Koramangala, Bengaluru', 'Whitefield, Bengaluru'];

export function LocationEditor({ value, onChange, onSave }: { value: LocationValue; onChange: (v: LocationValue) => void; onSave: () => void }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LocationValue, string>>>({});

  const set = (k: keyof LocationValue, v: string) => onChange({ ...value, [k]: v });

  const useCurrentLocation = () => {
    onChange({ address: '12, MG Road, Near Central Mall', landmark: 'Opposite Axis Bank', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' });
    setSearch('MG Road, Bengaluru');
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!value.address.trim()) next.address = 'Address is required';
    if (!value.city.trim()) next.city = 'City is required';
    if (!value.state.trim()) next.state = 'State is required';
    if (!/^\d{6}$/.test(value.pincode)) next.pincode = 'Enter a valid 6-digit pincode';
    setErrors(next);
    if (Object.keys(next).length === 0) onSave();
  };

  return (
    <div>
      <button
        onClick={() => setShowSuggestions(true)}
        className="mb-2 flex h-12 w-full items-center gap-2 rounded-ht-search border-[1.5px] border-ht-border bg-white px-3.5 text-left text-[14px] text-ht-text-secondary"
      >
        🔍 {search || 'Search address or locality'}
      </button>
      {showSuggestions && (
        <div className="mb-4 overflow-hidden rounded-ht-input border border-ht-border bg-white">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setSearch(s); setShowSuggestions(false); useCurrentLocation(); }}
              className="flex w-full items-center gap-2 border-b border-ht-border px-3.5 py-3 text-left text-[13px] text-ht-text last:border-b-0"
            >
              📍 {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative mb-4 flex h-40 flex-col items-center justify-center overflow-hidden rounded-ht-card border border-ht-border bg-ht-info-bg">
        <span className="text-2xl">🗺️</span>
        <p className="mt-1.5 text-[12px] font-medium text-ht-ocean">Map preview (pin drop)</p>
        <span className="absolute top-[42%] text-2xl">📍</span>
      </div>

      <button onClick={useCurrentLocation} className="mb-5 flex items-center gap-1.5 text-[13px] font-semibold text-ht-ocean">
        🧭 Use my current location
      </button>

      <Input label="Address" placeholder="House / building no., street" value={value.address} onChange={(e) => set('address', e.target.value)} error={errors.address} />
      <Input label="Landmark" placeholder="e.g. Opposite Axis Bank" value={value.landmark} onChange={(e) => set('landmark', e.target.value)} optional />
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="City" placeholder="Bengaluru" value={value.city} onChange={(e) => set('city', e.target.value)} error={errors.city} />
        </div>
        <div className="flex-1">
          <Input label="State" placeholder="Karnataka" value={value.state} onChange={(e) => set('state', e.target.value)} error={errors.state} />
        </div>
      </div>
      <Input label="Pincode" placeholder="560001" inputMode="numeric" maxLength={6} value={value.pincode} onChange={(e) => set('pincode', e.target.value.replace(/[^0-9]/g, ''))} error={errors.pincode} />

      <Button label="Save Location" onClick={validate} />
    </div>
  );
}
