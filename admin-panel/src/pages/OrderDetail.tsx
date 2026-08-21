import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, User, Scissors, MapPin, CreditCard } from 'lucide-react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { orders } from '../data/mockData';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <EmptyState title="Order not found" description="This order may have been removed." />;
  }

  return (
    <div>
      <button onClick={() => navigate('/orders')} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-navy">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-navy">{order.id}</h1>
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <p className="mt-1 text-sm text-text-secondary">Placed on {order.date} · {order.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <Card>
            <h3 className="mb-4 text-base font-semibold text-navy">Booking Lifecycle</h3>
            {order.status === 'Cancelled' ? (
              <div className="rounded-xl bg-[#FEF3F2] px-4 py-3 text-sm font-medium text-error">
                This order was cancelled on {order.date}.
              </div>
            ) : (
              <div className="flex flex-col">
                {order.timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.done ? <CheckCircle2 size={20} className="text-success" /> : <Circle size={20} className="text-disabled-text" />}
                      {i < order.timeline.length - 1 && <div className={`w-0.5 flex-1 ${step.done ? 'bg-success' : 'bg-border'}`} style={{ minHeight: 28 }} />}
                    </div>
                    <div className="pb-6">
                      <div className={`text-sm font-semibold ${step.done ? 'text-navy' : 'text-text-secondary'}`}>{step.label}</div>
                      {step.date && <div className="text-xs text-text-secondary">{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-3 text-base font-semibold text-navy">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div><div className="text-text-secondary">Category</div><div className="font-medium text-text-primary">{order.category}</div></div>
              <div><div className="text-text-secondary">City / State</div><div className="font-medium text-text-primary">{order.city}, {order.state}</div></div>
              <div><div className="text-text-secondary">Payment Method</div><div className="font-medium text-text-primary">{order.paymentMethod}</div></div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><User size={15} /> Customer</div>
            <Link to={`/customers/${order.customerId}`} className="text-sm font-medium text-ocean hover:underline">{order.customerName}</Link>
            <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary"><MapPin size={12} /> {order.city}, {order.state}</div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><Scissors size={15} /> Tailor</div>
            <Link to={`/tailors/${order.tailorId}`} className="text-sm font-medium text-ocean hover:underline">{order.tailorName}</Link>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><CreditCard size={15} /> Payment</div>
            <div className="flex justify-between text-sm py-1"><span className="text-text-secondary">Total Amount</span><span className="font-semibold text-navy">₹{order.amount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm py-1"><span className="text-text-secondary">Advance Paid</span><span className="font-medium text-text-primary">₹{order.advance.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm py-1"><span className="text-text-secondary">Balance Due</span><span className="font-medium text-text-primary">₹{order.balance.toLocaleString('en-IN')}</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
