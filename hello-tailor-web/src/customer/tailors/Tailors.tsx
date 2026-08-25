import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/seed';
import { clsx } from '@/components/ui/clsx';
import TailorCard from '@/customer/components/TailorCard';

export default function Tailors() {
  const navigate = useNavigate();
  const tailors = useStore((s) => s.tailors);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const list = activeCat ? tailors.filter((t) => t.categories.includes(activeCat)) : tailors;

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sm:px-6">
        <h1 className="text-[21px] font-semibold text-ht-text">All Tailors</h1>
        <button onClick={() => navigate('/customer/search')} className="flex h-10 w-10 items-center justify-center rounded-full border border-ht-border bg-ht-card">🔍</button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
        {categories.map((c) => {
          const active = activeCat === c.name;
          return (
            <button key={c.id} onClick={() => setActiveCat(active ? null : c.name)} className={clsx('shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium', active ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>
              {c.name}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {list.map((t) => <TailorCard key={t.id} tailor={t} wide />)}
      </div>
    </div>
  );
}
