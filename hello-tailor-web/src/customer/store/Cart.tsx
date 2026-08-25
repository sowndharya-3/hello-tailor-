import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (placed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <p className="mt-3 text-[17px] font-semibold text-ht-text">Order Placed</p>
        <p className="mt-1.5 text-[14px] text-ht-text-secondary">Your order will be delivered in 3-5 business days.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <ScreenHeader title="Cart" subtitle={`${cart.length} item(s)`} />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {cart.length ? cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
            <img src={item.image} alt="" className="h-13 w-13 rounded-ht-input object-cover" style={{ width: 52, height: 52 }} />
            <div className="flex-1">
              <p className="line-clamp-2 text-[14px] font-medium text-ht-text">{item.name}</p>
              <p className="text-[12px] text-ht-text-secondary">{item.qty} × ₹{item.price}</p>
            </div>
            <span className="text-[14px] font-bold text-ht-navy">₹{item.qty * item.price}</span>
            <button onClick={() => removeFromCart(item.id)} className="text-ht-error">🗑️</button>
          </div>
        )) : (
          <EmptyState icon="🛒" title="Your Cart is Empty" message="Browse the material or readymade store to add items to your cart." action={<Button label="Browse Materials" onClick={() => navigate(-1)} />} />
        )}
      </div>
      {cart.length ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card p-4 sm:left-56 sm:px-6">
          <button onClick={() => setPlaced(true)} className="flex min-h-[52px] w-full items-center justify-center rounded-ht-button bg-ht-ocean text-[15px] font-semibold text-white">
            Checkout • ₹{total}
          </button>
        </div>
      ) : null}
    </div>
  );
}
