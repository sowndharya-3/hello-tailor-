import { useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';

const GSTIN = '33ABCDE1234F1Z5';

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between py-1">
      <span className={bold ? 'text-[14px] font-bold text-ht-text' : 'text-[12px] text-ht-text-secondary'}>{label}</span>
      <span className={bold ? 'text-[14px] font-bold text-ht-text' : 'text-[12px] text-ht-text'}>{value}</span>
    </div>
  );
}

export default function Invoice() {
  const { id } = useParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Invoice" />
        <EmptyState icon="⚠️" title="Order Not Found" message="We couldn't find this order." />
      </div>
    );
  }

  const cgst = +(booking.tax / 2).toFixed(2);
  const sgst = +(booking.tax / 2).toFixed(2);
  const finalValue = booking.amount - booking.discount + booking.tax + booking.deliveryFee;
  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;
  const amountPaid = booking.amount - balanceDue;
  const notify = (action: string) => window.alert(`${action}: This is a UI-only mock — no file is generated in this preview.`);

  return (
    <div>
      <ScreenHeader
        title="Invoice"
        subtitle={booking.id}
        right={
          <div className="flex gap-3">
            <button onClick={() => notify('Download Invoice')}>⬇️</button>
            <button onClick={() => notify('Share Invoice')}>📤</button>
          </div>
        }
      />
      <div className="p-4 pb-8 sm:px-6">
        <div className="rounded-ht-card border border-ht-border bg-ht-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ht-navy">Hello Tailor</p>
            <p className="text-[12px] text-ht-text-secondary">Invoice #INV-{booking.id.slice(-8)}</p>
          </div>
          <p className="mt-1 text-[12px] text-ht-text-secondary">Date: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</p>

          <div className="my-3 h-px bg-ht-border" />
          <p className="text-[11px] font-semibold uppercase text-ht-text-secondary">Billed To</p>
          <p className="mt-0.5 text-[14px] font-medium text-ht-text">{booking.customerName || ME_CUSTOMER.name}</p>
          <p className="text-[12px] text-ht-text-secondary">{ME_CUSTOMER.phone}</p>

          <p className="mt-3 text-[11px] font-semibold uppercase text-ht-text-secondary">Service Provider</p>
          <p className="mt-0.5 text-[14px] font-medium text-ht-text">{tailor?.shopName ?? booking.tailorName}</p>
          <p className="text-[12px] text-ht-text-secondary">GSTIN: {GSTIN}</p>

          <div className="my-3 h-px bg-ht-border" />
          <div className="flex justify-between">
            <span className="text-[14px] font-medium text-ht-text">{booking.category}</span>
            <span className="text-[14px] text-ht-text">₹{booking.amount}</span>
          </div>
          <p className="mt-0.5 text-[12px] text-ht-text-secondary">Order ID: {booking.id}</p>

          <div className="my-3 h-px bg-ht-border" />
          <Row label="Subtotal" value={`₹${booking.amount}`} />
          <Row label="Discount" value={booking.discount ? `-₹${booking.discount}` : '₹0'} />
          <Row label="CGST (2.5%)" value={`₹${cgst}`} />
          <Row label="SGST (2.5%)" value={`₹${sgst}`} />
          <Row label="Total GST" value={`₹${booking.tax}`} />
          <Row label="Delivery Fee" value={`₹${booking.deliveryFee}`} />
          <div className="my-3 h-px bg-ht-border" />
          <Row label="Final Value" value={`₹${finalValue}`} bold />
          <Row label="Advance Paid" value={`₹${booking.advanceAmount}`} />
          <Row label="Balance" value={`₹${balanceDue}`} />
          <Row label="Amount Paid" value={`₹${amountPaid}`} />
          <div className="my-3 h-px bg-ht-border" />
          <Row label="Payment Method" value={booking.paymentMethod} />
          <Row label="Transaction ID" value={`TXN${booking.id.slice(-10)}`} />
        </div>
      </div>
    </div>
  );
}
