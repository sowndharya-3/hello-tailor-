import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';
import TailorCard from '@/customer/components/TailorCard';

const RECENT = ['Blouse tailor near me', 'Suit stitching', 'Alteration'];
const POPULAR = ['Kurti stitching', 'Shirt tailor', 'Wedding blouse', 'Pant alteration'];
const SORTS = ['Relevance', 'Rating', 'Distance', 'Price: Low to High'];

export default function Search() {
  const tailors = useStore((s) => s.tailors);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('Relevance');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [availableOnly, setAvailableOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    let list = tailors.filter((t) => {
      const matches = !q || t.name.toLowerCase().includes(q) || t.shopName.toLowerCase().includes(q) || t.categories.some((c) => c.toLowerCase().includes(q));
      return matches && t.rating >= minRating && t.startingPrice <= maxPrice && (!availableOnly || t.isOpen);
    });
    if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'Distance') list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
    return list;
  }, [tailors, query, sort, minRating, maxPrice, availableOnly]);

  return (
    <div>
      <ScreenHeader title="Search" back={false} />
      <div className="flex gap-2 px-4 py-3 sm:px-6">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-ht-search border border-ht-border bg-ht-card px-3.5">
          <span className="text-ht-text-secondary">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tailors, categories..."
            className="w-full bg-transparent text-[14px] text-ht-text outline-none placeholder:text-ht-disabled-text"
          />
        </div>
        <button onClick={() => setFiltersOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-ht-search border border-ht-border bg-ht-card">⚙️</button>
        <button onClick={() => setSortOpen(true)} className="flex h-12 w-12 items-center justify-center rounded-ht-search border border-ht-border bg-ht-card">↕️</button>
      </div>

      {!query ? (
        <div className="px-4 sm:px-6">
          <p className="mb-2 text-[13px] font-semibold text-ht-text-secondary">Recent Searches</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {RECENT.map((r) => (
              <button key={r} onClick={() => setQuery(r)} className="flex items-center gap-1.5 rounded-full border border-ht-border bg-ht-card px-3 py-2 text-[13px] text-ht-text">🕐 {r}</button>
            ))}
          </div>
          <p className="mb-2 text-[13px] font-semibold text-ht-text-secondary">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((r) => (
              <button key={r} onClick={() => setQuery(r)} className="flex items-center gap-1.5 rounded-full border border-ht-border bg-ht-card px-3 py-2 text-[13px] text-ht-text">📈 {r}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {results.length ? results.map((t) => <TailorCard key={t.id} tailor={t} wide />) : (
            <div className="col-span-full">
              <EmptyState icon="🔍" title="No Tailors Found" message="Try a different keyword or adjust your filters." />
            </div>
          )}
        </div>
      )}

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <p className="mb-2 text-[14px] font-medium text-ht-text">Category</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((c) => (
            <span key={c.id} className="rounded-full border border-ht-border bg-ht-card px-3 py-2 text-[13px] text-ht-text">{c.name}</span>
          ))}
        </div>
        <p className="mb-2 text-[14px] font-medium text-ht-text">Minimum Rating: {minRating || 'Any'}</p>
        <div className="mb-4 flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={clsx('rounded-full border px-3.5 py-2 text-[13px]', minRating === r ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border text-ht-text')}>
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
        <p className="mb-2 text-[14px] font-medium text-ht-text">Max Price: ₹{maxPrice}</p>
        <div className="mb-4 flex gap-2">
          {[500, 1000, 2000, 5000].map((p) => (
            <button key={p} onClick={() => setMaxPrice(p)} className={clsx('rounded-full border px-3.5 py-2 text-[13px]', maxPrice === p ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border text-ht-text')}>
              ₹{p}
            </button>
          ))}
        </div>
        <button onClick={() => setAvailableOnly((v) => !v)} className="mb-4 flex w-full items-center justify-between">
          <span className="text-[14px] font-medium text-ht-text">Available Now Only</span>
          <span>{availableOnly ? '☑️' : '⬜'}</span>
        </button>
        <Button label="Apply Filters" onClick={() => setFiltersOpen(false)} />
      </Modal>

      <Modal open={sortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        {SORTS.map((s) => (
          <button key={s} onClick={() => { setSort(s); setSortOpen(false); }} className="flex w-full items-center justify-between border-b border-ht-border py-3.5 text-left text-[14px] text-ht-text">
            {s} {sort === s ? <span className="text-ht-ocean">✓</span> : null}
          </button>
        ))}
      </Modal>
    </div>
  );
}
