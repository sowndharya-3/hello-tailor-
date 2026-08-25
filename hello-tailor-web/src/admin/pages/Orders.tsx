import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { useStore } from '@/store/useStore';
import type { Booking, BookingStatus } from '@/store/types';
import { formatMoney, bookingPaymentStatus, ORDER_STAGES } from '../lib/helpers';
import { CITIES } from '@/data/seed';

export default function Orders() {
  const navigate = useNavigate();
  const bookings = useStore((s) => s.bookings);
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [city, setCity] = useState('');

  const filtered = useMemo(() => {
    return bookings.filter((o) =>
      (!orderId || o.id.toLowerCase().includes(orderId.toLowerCase())) &&
      (!customer || o.customerName.toLowerCase().includes(customer.toLowerCase()) || o.tailorName.toLowerCase().includes(customer.toLowerCase())) &&
      (!status || o.status === status) &&
      (!paymentStatus || bookingPaymentStatus(o) === paymentStatus) &&
      (!city || o.city === city)
    );
  }, [bookings, orderId, customer, status, paymentStatus, city]);

  const columns: Column<Booking>[] = [
    { key: 'id', header: 'Order ID', sortValue: (o) => o.id, render: (o) => <span className="font-medium text-ht-ocean">{o.id}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'tailorName', header: 'Tailor' },
    { key: 'category', header: 'Category' },
    { key: 'city', header: 'City' },
    { key: 'bookingDate', header: 'Date', sortValue: (o) => o.bookingDate },
    { key: 'amount', header: 'Amount', sortValue: (o) => o.amount, render: (o) => formatMoney(o.amount) },
    { key: 'paymentStatus', header: 'Payment', render: (o) => <StatusBadge status={bookingPaymentStatus(o)} /> },
    { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  const actions: RowAction<Booking>[] = [
    { label: 'View Details', onClick: (o) => navigate(`/admin/orders/${o.id}`) },
  ];

  const clearAll = () => { setOrderId(''); setCustomer(''); setStatus(''); setPaymentStatus(''); setCity(''); };
  const hasFilters = orderId || customer || status || paymentStatus || city;

  const statusOptions: BookingStatus[] = [...ORDER_STAGES, 'Requested', 'Rejected', 'Cancelled'];

  return (
    <div>
      <PageHeader title="Order Management" description={`${bookings.length} orders across the platform`} />

      <Card padded={false} className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Input placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          <Input placeholder="Customer / Tailor" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <Select placeholder="All Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[...new Set(statusOptions)].map((s) => ({ label: s, value: s }))} />
          <Select placeholder="All Payments" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} options={['Paid', 'Partial', 'Pending'].map((s) => ({ label: s, value: s }))} />
          <Select placeholder="All Cities" value={city} onChange={(e) => setCity(e.target.value)} options={CITIES.map((c) => ({ label: c.city, value: c.city }))} />
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearAll}>Clear filters</Button>}
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(o) => o.id}
          actions={actions}
          emptyTitle="No Orders Found"
          emptyDescription="Try adjusting your filters to find what you're looking for."
        />
      </Card>
    </div>
  );
}
