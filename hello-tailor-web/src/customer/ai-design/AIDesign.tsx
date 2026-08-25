import { useRef, useState } from 'react';
import { categories } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { clsx } from '@/components/ui/clsx';

const PREFERENCES = ['Minimal', 'Traditional', 'Contemporary', 'Fusion', 'Formal'];

export default function AIDesign() {
  const [garment, setGarment] = useState(categories[0].name);
  const [pref, setPref] = useState(PREFERENCES[0]);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = () => { setState('generating'); setTimeout(() => setState('done'), 1800); };
  const suggestions = [0, 1, 2, 3].map((i) => `https://picsum.photos/seed/aidesign-${garment}-${pref}-${i}/400/500`);

  return (
    <div>
      <ScreenHeader title="AI Design Suggestions" subtitle="Beta" />
      <div className="p-4 pb-8 sm:px-6">
        <div className="mb-5 flex items-center gap-2 rounded-ht-card bg-ht-gold-light p-4">
          <span>✨</span>
          <p className="flex-1 text-[13px] text-ht-gold">Get AI-generated design ideas for your next stitching order.</p>
          <Badge label="BETA" tone="gold" />
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Select Garment</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c.id} onClick={() => { setGarment(c.name); setState('idle'); }} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', garment === c.name ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c.name}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Style Preference</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PREFERENCES.map((p) => (
            <button key={p} onClick={() => { setPref(p); setState('idle'); }} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', pref === p ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{p}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Reference Photo <span className="font-normal text-ht-text-secondary">(optional)</span></p>
        {refImage ? (
          <img src={refImage} alt="" className="h-25 w-25 rounded-ht-input object-cover" style={{ width: 100, height: 100 }} />
        ) : (
          <button onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-ht-button border-[1.5px] border-dashed border-ht-border py-3.5 text-[14px] font-medium text-ht-ocean">
            🖼️ Upload Reference
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setRefImage(URL.createObjectURL(f)); }} />

        <Button label={state === 'generating' ? 'Generating…' : 'Generate Suggestions'} variant="gold" className="mt-5" onClick={generate} disabled={state === 'generating'} />

        {state === 'done' ? (
          <div className="mt-6 grid grid-cols-2 gap-3.5">
            {suggestions.map((uri) => (
              <div key={uri} className="overflow-hidden rounded-ht-card border border-ht-border bg-ht-card">
                <img src={uri} alt="" className="h-40 w-full object-cover" />
                <div className="flex flex-col gap-1.5 p-2">
                  <button onClick={() => window.alert('Saved: Design saved to your favourites.')} className="flex items-center justify-center gap-1 rounded-ht-button border border-ht-ocean py-2 text-[11px] font-semibold text-ht-ocean">🔖 Save</button>
                  <button onClick={() => window.alert('Added to Booking: This design reference will be used in your next booking.')} className="flex items-center justify-center gap-1 rounded-ht-button bg-ht-ocean py-2 text-[11px] font-semibold text-white">✓ Use in Booking</button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
