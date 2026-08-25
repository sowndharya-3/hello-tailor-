// Ported from hello-tailor-app/app/(tailor)/profile/categories.tsx. The shared Tailor.categories
// field stores category NAMES (not ids, see data/seed.ts), so selection is keyed on name.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { categories } from '@/data/seed';
import { useMyTailor, useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

export default function Categories() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [selected, setSelected] = useState<string[]>(tailor.categories);
  const navigate = useNavigate();

  const toggle = (name: string) => setSelected((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  const onSave = () => {
    updateTailorProfile({ categories: selected });
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Stitching Categories" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <p className="mb-4 text-[13px] leading-relaxed text-ht-text-secondary">
          These categories come from Hello Tailor's master category list. Toggle the ones you offer.
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = selected.includes(c.name);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.name)}
                className={clsx(
                  'rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                  active ? 'border-ht-ocean bg-ht-info-bg text-ht-ocean' : 'border-ht-border bg-white text-ht-text',
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
