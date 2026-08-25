import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { readymade } from '@/data/seed';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { clsx } from '@/components/ui/clsx';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ReadymadeDetail() {
  const { id } = useParams<{ id: string }>();
  const item = readymade.find((m) => m.id === id) ?? readymade[0];
  const addToCart = useStore((s) => s.addToCart);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);

  return (
    <div className="pb-24">
      <ScreenHeader title="Product Details" />
      <img src={item.image} alt={item.name} className="h-70 w-full object-cover" style={{ height: 280 }} />
      <div className="p-4 sm:px-6">
        <h1 className="text-[21px] font-semibold text-ht-text">{item.name}</h1>
        <p className="mt-0.5 text-[14px] text-ht-text-secondary">{item.category}'s Wear</p>
        <p className="mt-3 text-[26px] font-bold text-ht-navy">₹{item.price}</p>

        <p className="mb-2 mt-5 text-[14px] font-medium text-ht-text">Select Size</p>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setSize(s)} className={clsx('flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-semibold', size === s ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{s}</button>
          ))}
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-ht-text-secondary">Ready-to-wear garment, no stitching wait. Standard fit, machine washable. Exchange available within 7 days for size issues.</p>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card p-4 sm:left-56 sm:px-6">
        <button
          onClick={() => { addToCart({ id: item.id, name: `${item.name} (${size})`, price: item.price, image: item.image, qty: 1 }); setAdded(true); }}
          className="flex min-h-[52px] w-full items-center justify-center rounded-ht-button bg-ht-ocean text-[15px] font-semibold text-white"
        >
          {added ? 'Added to Cart ✓' : `Add to Cart • ₹${item.price}`}
        </button>
      </div>
    </div>
  );
}
