import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { readymade } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { clsx } from '@/components/ui/clsx';

const CATS = ['All', 'Men', 'Women', 'Kids'];

export default function ReadymadeStore() {
  const cart = useStore((s) => s.cart);
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? readymade : readymade.filter((m) => m.category === cat);

  return (
    <div>
      <ScreenHeader
        title="Readymade Dress Store"
        subtitle="Ready to wear, no stitching wait"
        right={
          <Link to="/customer/store/material/cart" className="relative text-xl">
            🛒
            {cart.length ? <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ht-error" /> : null}
          </Link>
        }
      />
      <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={clsx('shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium', cat === c ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3.5 p-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4">
        {list.map((m) => (
          <Link key={m.id} to={`/customer/store/readymade/${m.id}`} className="overflow-hidden rounded-ht-card border border-ht-border bg-ht-card">
            <img src={m.image} alt={m.name} className="h-30 w-full object-cover" style={{ height: 120 }} />
            <div className="p-3.5">
              <p className="line-clamp-2 text-[13px] font-medium text-ht-text">{m.name}</p>
              <p className="mt-1 text-[15px] font-semibold text-ht-navy">₹{m.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
