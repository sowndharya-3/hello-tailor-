import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { materials } from '@/data/seed';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const item = materials.find((m) => m.id === id) ?? materials[0];
  const addToCart = useStore((s) => s.addToCart);
  const [meters, setMeters] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="pb-24">
      <ScreenHeader title="Product Details" />
      <img src={item.image} alt={item.name} className="h-65 w-full object-cover" style={{ height: 260 }} />
      <div className="p-4 sm:px-6">
        <h1 className="text-[21px] font-semibold text-ht-text">{item.name}</h1>
        <p className="mt-0.5 text-[14px] text-ht-text-secondary">{item.category} Fabric</p>
        <p className="mt-3 text-[26px] font-bold text-ht-navy">₹{item.price} <span className="text-[13px] font-normal text-ht-text-secondary">{item.unit}</span></p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[14px] font-medium text-ht-text">Meters</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setMeters((m) => Math.max(1, m - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-ht-disabled-bg text-lg">−</button>
            <span className="min-w-6 text-center text-[17px] font-semibold text-ht-text">{meters}</span>
            <button onClick={() => setMeters((m) => m + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ht-disabled-bg text-lg">+</button>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-ht-text-secondary">Premium quality {item.category.toLowerCase()} fabric, ideal for tailoring. Pre-shrunk and colourfast. Sold by the meter — minimum order 1 meter.</p>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card p-4 sm:left-56 sm:px-6">
        <button
          onClick={() => { addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, qty: meters }); setAdded(true); }}
          className="flex min-h-[52px] w-full items-center justify-center rounded-ht-button bg-ht-ocean text-[15px] font-semibold text-white"
        >
          {added ? 'Added to Cart ✓' : `Add to Cart • ₹${item.price * meters}`}
        </button>
      </div>
    </div>
  );
}
