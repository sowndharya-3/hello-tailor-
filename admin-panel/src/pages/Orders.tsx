import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { orders, CITIES } from '../data/mockData';
import type { Order } from '../types';

export default function Orders() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [city, setCity] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) =>
      (!orderId || o.id.toLowerCase().includes(orderId.toLowerCase())) &&
      (!customer || o.customerName.toLowerCase().includes(customer.toLowerCase()) || o.tailorName.toLowerCase().includes(customer.toLowerCase())) &&
      (!status || o.status === status) &&
      (!paymentStatus || o.paymentStatus === paymentStatus) &&
      (!city || o.city === city)
    );
  }, [orderId, customer, status, paymentStatus, city]);

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Order ID', sortValue: (o) => o.id, render: (o) => <span className="font-medium text-ocean">{o.id}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'tailorName', header: 'Tailor' },
    { key: 'category', header: 'Category' },
    { key: 'city', header: 'City' },
    { key: 'date', header: 'Date', sortValue: (o) => o.date },
    { key: 'amount', header: 'Amount', sortValue: (o) => o.amount, render: (o) => `₹${o.amount.toLocaleString('en-IN')}` },
    { key: 'paymentStatus', header: 'Payment', render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  const actions: RowAction<Order>[] = [
    { label: 'View Details', onClick: (o) => navigate(`/orders/${o.id}`) },
  ];

  const clearAll = () => { setOrderId(''); setCustomer(''); setStatus(''); setPaymentStatus(''); setCity(''); };
  const hasFilters = orderId || customer || status || paymentStatus || city;

  return (
    <div>
      <PageHeader title="Order Management" description={`${orders.length} orders across the platform`} />

      <Card padded={false} className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Input placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          <Input placeholder="Customer / Tailor" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <Select placeholder="All Status" value={status} onChange={(e) => setStatus(e.target.value)} options={['Placed', 'Confirmed', 'Measurement Scheduled', 'In Stitching', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map((s) => ({ label: s, value: s }))} />
          <Select placeholder="All Payments" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} options={['Paid', 'Partial', 'Pending', 'Refunded', 'Failed'].map((s) => ({ label: s, value: s }))} />
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
