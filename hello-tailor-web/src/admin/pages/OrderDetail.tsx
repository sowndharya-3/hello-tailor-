import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, User, Scissors, MapPin, CreditCard } from 'lucide-react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { formatMoney, formatDate, bookingPaymentStatus, bookingBalance, ORDER_STAGES } from '../lib/helpers';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useStore((s) => s.bookings.find((o) => o.id === id));

  const timeline = useMemo(() => {
    if (!order) return [];
    const doneStages = new Set(order.history.map((h) => h.stage));
    const currentIdx = ORDER_STAGES.indexOf(order.status);
    return ORDER_STAGES.map((stage, i) => {
      const historyEntry = order.history.find((h) => h.stage === stage);
      const done = doneStages.has(stage) || i <= currentIdx;
      return { label: stage, date: historyEntry ? formatDate(historyEntry.at) : '', done };
    });
  }, [order]);

  if (!order) {
    return <EmptyState title="Order not found" description="This order may have been removed." />;
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/orders')} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ht-text-secondary hover:text-ht-navy">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-ht-navy">{order.id}</h1>
            <StatusBadge status={order.status} />
            <StatusBadge status={bookingPaymentStatus(order)} />
          </div>
          <p className="mt-1 text-sm text-ht-text-secondary">Placed on {formatDate(order.bookingDate)} · {order.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <Card>
            <h3 className="mb-4 text-base font-semibold text-ht-navy">Booking Lifecycle</h3>
            {order.status === 'Cancelled' || order.status === 'Rejected' ? (
              <div className="rounded-xl bg-[#FEF3F2] px-4 py-3 text-sm font-medium text-ht-error">
                This order was {order.status.toLowerCase()} on {formatDate(order.bookingDate)}.
                {order.cancelReason && ` Reason: ${order.cancelReason}`}
                {order.rejectReason && ` Reason: ${order.rejectReason}`}
              </div>
            ) : (
              <div className="flex flex-col">
                {timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.done ? <CheckCircle2 size={20} className="text-ht-success" /> : <Circle size={20} className="text-ht-disabled-text" />}
                      {i < timeline.length - 1 && <div className={`w-0.5 flex-1 ${step.done ? 'bg-ht-success' : 'bg-ht-border'}`} style={{ minHeight: 28 }} />}
                    </div>
                    <div className="pb-6">
                      <div className={`text-sm font-semibold ${step.done ? 'text-ht-navy' : 'text-ht-text-secondary'}`}>{step.label}</div>
                      {step.date && <div className="text-xs text-ht-text-secondary">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-3 text-base font-semibold text-ht-navy">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div><div className="text-ht-text-secondary">Category</div><div className="font-medium text-ht-text">{order.category}</div></div>
              <div><div className="text-ht-text-secondary">City / State</div><div className="font-medium text-ht-text">{order.city}, {order.state}</div></div>
              <div><div className="text-ht-text-secondary">Payment Method</div><div className="font-medium text-ht-text">{order.paymentMethod}</div></div>
              <div><div className="text-ht-text-secondary">Pickup Type</div><div className="font-medium text-ht-text">{order.pickupType}</div></div>
              <div><div className="text-ht-text-secondary">Delivery Date</div><div className="font-medium text-ht-text">{formatDate(order.deliveryDate)}</div></div>
              <div><div className="text-ht-text-secondary">Location</div><div className="font-medium text-ht-text">{order.location}</div></div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ht-navy"><User size={15} /> Customer</div>
            <Link to={`/admin/customers/${order.customerId}`} className="text-sm font-medium text-ht-ocean hover:underline">{order.customerName}</Link>
            <div className="mt-1 flex items-center gap-1 text-xs text-ht-text-secondary"><MapPin size={12} /> {order.city}, {order.state}</div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ht-navy"><Scissors size={15} /> Tailor</div>
            <Link to={`/admin/tailors/${order.tailorId}`} className="text-sm font-medium text-ht-ocean hover:underline">{order.tailorName}</Link>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ht-navy"><CreditCard size={15} /> Payment</div>
            <div className="flex justify-between text-sm py-1"><span className="text-ht-text-secondary">Total Amount</span><span className="font-semibold text-ht-navy">{formatMoney(order.amount)}</span></div>
            <div className="flex justify-between text-sm py-1"><span className="text-ht-text-secondary">Advance Paid</span><span className="font-medium text-ht-text">{formatMoney(order.advanceAmount)}</span></div>
            <div className="flex justify-between text-sm py-1"><span className="text-ht-text-secondary">Balance Due</span><span className="font-medium text-ht-text">{formatMoney(bookingBalance(order))}</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
