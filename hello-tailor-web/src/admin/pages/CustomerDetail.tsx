import { useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, ShoppingBag, Ban, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { Booking, Payment } from '@/store/types';
import { formatMoney, bookingPaymentStatus } from '../lib/helpers';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') ?? 'Overview');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const customer = useStore((s) => s.customers.find((c) => c.id === id));
  const bookings = useStore((s) => s.bookings);
  const payments = useStore((s) => s.payments);
  const updateCustomerStatus = useStore((s) => s.updateCustomerStatus);

  const custOrders = useMemo(() => bookings.filter((b) => b.customerId === id), [bookings, id]);
  const custPayments = useMemo(() => payments.filter((p) => custOrders.some((o) => o.id === p.bookingId)), [custOrders, payments]);

  if (!customer) {
    return <EmptyState title="Customer not found" description="This customer may have been removed." />;
  }

  const orderCols: Column<Booking>[] = [
    { key: 'id', header: 'Order ID', render: (o) => <Link to={`/admin/orders/${o.id}`} className="font-medium text-ht-ocean hover:underline">{o.id}</Link> },
    { key: 'category', header: 'Category' },
    { key: 'tailorName', header: 'Tailor' },
    { key: 'bookingDate', header: 'Date', sortValue: (o) => o.bookingDate },
    { key: 'amount', header: 'Amount', sortValue: (o) => o.amount, render: (o) => formatMoney(o.amount) },
    { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  const payCols: Column<Payment>[] = [
    { key: 'id', header: 'Payment ID' },
    { key: 'bookingId', header: 'Order ID' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount', sortValue: (p) => p.amount, render: (p) => formatMoney(p.amount) },
    { key: 'method', header: 'Method' },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'date', header: 'Date', sortValue: (p) => p.date },
  ];

  return (
    <div>
      <button onClick={() => navigate('/admin/customers')} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ht-text-secondary hover:text-ht-navy">
        <ArrowLeft size={16} /> Back to Customers
      </button>

      <Card className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={customer.avatar} size={64} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-ht-navy">{customer.name}</h1>
                <StatusBadge status={customer.status} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ht-text-secondary">
                <span className="flex items-center gap-1"><Phone size={13} /> {customer.mobile}</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {customer.email}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {customer.city}, {customer.state}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> Joined {customer.joinedDate}</span>
              </div>
            </div>
          </div>
          <Button
            variant={customer.status === 'Blocked' ? 'primary' : 'destructive'}
            icon={customer.status === 'Blocked' ? <CheckCircle2 size={16} /> : <Ban size={16} />}
            onClick={() => setConfirmOpen(true)}
          >
            {customer.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-ht-border pt-5 sm:grid-cols-4">
          <Stat label="Total Orders" value={customer.ordersCount.toString()} />
          <Stat label="Total Spend" value={formatMoney(customer.totalSpend)} />
          <Stat label="Membership" value={customer.membership} />
          <Stat label="Customer ID" value={customer.id} />
        </div>
      </Card>

      <Card padded={false} className="p-5">
        <Tabs tabs={['Overview', 'Orders', 'Payments']} active={tab} onChange={setTab} />
        <div className="pt-5">
          {tab === 'Overview' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ht-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ht-navy"><ShoppingBag size={15} /> Recent Orders</div>
                {custOrders.slice(0, 3).map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-ht-text">{o.category}</span>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
                {custOrders.length === 0 && <p className="text-sm text-ht-text-secondary">No orders yet.</p>}
              </div>
              <div className="rounded-xl border border-ht-border p-4">
                <div className="mb-2 text-sm font-semibold text-ht-navy">Account Notes</div>
                <p className="text-sm text-ht-text-secondary">No support notes on file for this customer.</p>
              </div>
            </div>
          )}
          {tab === 'Orders' && <DataTable columns={orderCols} rows={custOrders} rowKey={(o) => o.id} emptyTitle="No Orders" emptyDescription="This customer hasn't placed any orders yet." />}
          {tab === 'Payments' && (
            <DataTable
              columns={payCols}
              rows={custPayments.length ? custPayments : custOrders.map((o) => ({
                id: `derived-${o.id}`, bookingId: o.id, customerName: o.customerName, tailorName: o.tailorName,
                type: 'Advance' as const, amount: o.amount, status: bookingPaymentStatus(o), method: o.paymentMethod, gatewayRef: '—', date: o.bookingDate,
              }))}
              rowKey={(p) => p.id}
              emptyTitle="No Payments"
              emptyDescription="No payment records for this customer yet."
            />
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title={customer.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
        message={`Are you sure you want to ${customer.status === 'Blocked' ? 'unblock' : 'block'} ${customer.name}?`}
        confirmLabel={customer.status === 'Blocked' ? 'Unblock' : 'Block'}
        destructive={customer.status !== 'Blocked'}
        onConfirm={() => {
          const next = customer.status === 'Blocked' ? 'Active' : 'Blocked';
          updateCustomerStatus(customer.id, next);
          show('success', `${customer.name} has been ${next === 'Blocked' ? 'blocked' : 'unblocked'}.`);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-ht-text-secondary">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-ht-navy">{value}</div>
    </div>
  );
}
