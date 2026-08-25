import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { materials } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { clsx } from '@/components/ui/clsx';

const CATS = ['All', 'Cotton', 'Linen', 'Silk', 'Georgette', 'Wool'];

export default function MaterialStore() {
  const cart = useStore((s) => s.cart);
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? materials : materials.filter((m) => m.category === cat);

  return (
    <div>
      <ScreenHeader
        title="Material Store"
        subtitle="Fabrics by the meter"
        right={
          <Link to="/customer/store/material/cart" className="relative text-xl">
            🛒
            {cart.length ? <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ht-error" /> : null}
          </Link>
        }
      />
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-ht-input bg-ht-gold-light p-2.5 sm:mx-6">
        <span>✨</span>
        <p className="flex-1 text-[13px] text-ht-gold">New: Order fabric directly and have it delivered before your stitching appointment</p>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={clsx('shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium', cat === c ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3.5 p-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4">
        {list.map((m) => (
          <Link key={m.id} to={`/customer/store/material/${m.id}`} className="overflow-hidden rounded-ht-card border border-ht-border bg-ht-card">
            <img src={m.image} alt={m.name} className="h-30 w-full object-cover" style={{ height: 120 }} />
            <div className="p-3.5">
              <p className="line-clamp-2 text-[13px] font-medium text-ht-text">{m.name}</p>
              <p className="mt-1 text-[15px] font-semibold text-ht-navy">₹{m.price} <span className="text-[12px] font-normal text-ht-text-secondary">{m.unit}</span></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
