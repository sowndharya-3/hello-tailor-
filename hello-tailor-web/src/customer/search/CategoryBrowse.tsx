import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import { clsx } from '@/components/ui/clsx';
import TailorCard from '@/customer/components/TailorCard';

export default function CategoryBrowse() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const tailors = useStore((s) => s.tailors);
  const initial = categories.find((c) => c.id === id)?.name ?? null;
  const [active, setActive] = useState<string | null>(initial);

  const list = active ? tailors.filter((t) => t.categories.includes(active)) : tailors;

  return (
    <div>
      <ScreenHeader title="Browse Categories" />
      <div className="flex gap-3.5 overflow-x-auto px-4 py-4 sm:px-6">
        {categories.map((c) => {
          const isActive = active === c.name;
          return (
            <button key={c.id} onClick={() => setActive(isActive ? null : c.name)} className="flex w-17 shrink-0 flex-col items-center gap-1.5">
              <div className={clsx('flex h-13 w-13 items-center justify-center rounded-full text-lg', isActive ? 'bg-ht-ocean text-white' : 'bg-ht-info-bg text-ht-ocean')} style={{ width: 52, height: 52 }}>🧵</div>
              <span className={clsx('text-center text-[12px]', isActive ? 'font-semibold text-ht-ocean' : 'text-ht-text')}>{c.name}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {list.length ? list.map((t) => <TailorCard key={t.id} tailor={t} wide />) : (
          <div className="col-span-full">
            <EmptyState icon="🗂️" title="No Tailors Found" message="No tailors currently offer this category nearby." />
          </div>
        )}
      </div>
    </div>
  );
}
