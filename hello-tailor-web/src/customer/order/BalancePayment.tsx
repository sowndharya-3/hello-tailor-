import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className={bold ? 'text-[14px] font-semibold text-ht-text' : muted ? 'text-[14px] text-ht-text-secondary' : 'text-[14px] text-ht-text'}>{label}</span>
      <span className={bold ? 'text-[18px] font-bold text-ht-navy' : muted ? 'text-[14px] text-ht-text-secondary' : 'text-[14px] text-ht-text'}>{value}</span>
    </div>
  );
}

export default function BalancePayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Pay Balance" />
        <EmptyState icon="⚠️" title="Order Not Found" message="We couldn't find this order." />
      </div>
    );
  }

  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;
  const pay = () => { setState('processing'); setTimeout(() => setState('success'), 1400); };

  if (state === 'success') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <p className="mt-3 text-[17px] font-semibold text-ht-text">Payment Successful</p>
        <p className="mt-1.5 text-[14px] text-ht-text-secondary">₹{balanceDue} balance paid for order {booking.id}</p>
        <div className="mt-5 w-full max-w-sm"><Button label="View Invoice" onClick={() => navigate(`/customer/order/${booking.id}/invoice`, { replace: true })} /></div>
      </div>
    );
  }
  if (state === 'processing') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ht-ocean border-t-transparent" />
        <p className="text-[17px] font-semibold text-ht-text">Processing Payment</p>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Pay Balance" subtitle={booking.id} />
      <div className="p-4 sm:px-6">
        <div className="rounded-ht-card border border-ht-border bg-ht-card p-4">
          <Row label="Total Order Value" value={`₹${booking.amount}`} />
          <Row label="Advance Paid" value={`-₹${booking.advanceAmount}`} muted />
          <Row label="Discount" value={booking.discount ? `-₹${booking.discount}` : '₹0'} muted />
          <Row label="Tax (GST)" value={`₹${booking.tax}`} muted />
          <div className="my-2 h-px bg-ht-border" />
          <Row label="Balance Due" value={`₹${balanceDue}`} bold />
        </div>
        <div className="mt-5"><Button label={`Pay ₹${balanceDue}`} onClick={pay} /></div>
      </div>
    </div>
  );
}
