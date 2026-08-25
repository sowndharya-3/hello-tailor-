// Ported from hello-tailor-app/components/tailor/PriceListEditor.tsx, driven by the shared
// PriceEntry type (store/useStore) and category catalog (data/seed).
import { categories } from '@/data/seed';
import SegmentedControl from '@/components/ui/SegmentedControl';
import type { PriceEntry } from '@/store/useStore';

const TYPE_OPTIONS = [
  { label: 'Starting at', value: 'Starting at' as const },
  { label: 'Fixed', value: 'Fixed' as const },
];

export function PriceListEditor({ categoryIds, prices, onChange }: { categoryIds: string[]; prices: PriceEntry[]; onChange: (p: PriceEntry[]) => void }) {
  const entryFor = (catId: string): PriceEntry =>
    prices.find((p) => p.categoryId === catId) ?? { categoryId: catId, type: 'Starting at', price: '', notes: '' };

  const update = (catId: string, patch: Partial<PriceEntry>) => {
    const next = { ...entryFor(catId), ...patch };
    onChange([...prices.filter((p) => p.categoryId !== catId), next]);
  };

  return (
    <div className="flex flex-col gap-3">
      {categoryIds.map((catId) => {
        const cat = categories.find((c) => c.id === catId);
        const entry = entryFor(catId);
        return (
          <div key={catId} className="rounded-ht-card border border-ht-border bg-white p-4">
            <p className="mb-2 font-semibold text-ht-text">{cat?.name ?? catId}</p>
            <SegmentedControl options={TYPE_OPTIONS} value={entry.type} onChange={(v) => update(catId, { type: v })} />
            <div className="mt-2 flex h-12 items-center rounded-ht-input border-[1.5px] border-ht-border px-3.5">
              <span className="mr-1.5 font-semibold text-ht-text-secondary">₹</span>
              <input
                value={entry.price}
                onChange={(e) => update(catId, { price: e.target.value.replace(/[^0-9]/g, '') })}
                inputMode="numeric"
                placeholder="0"
                className="w-full font-semibold text-[16px] text-ht-text outline-none placeholder:text-ht-disabled-text"
              />
            </div>
            <input
              value={entry.notes ?? ''}
              onChange={(e) => update(catId, { notes: e.target.value })}
              placeholder="Notes (e.g. excludes lining)"
              className="mt-2 w-full text-[13px] text-ht-text outline-none placeholder:text-ht-text-secondary"
            />
          </div>
        );
      })}
    </div>
  );
}
