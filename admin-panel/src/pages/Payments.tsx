import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import { payments } from '../data/mockData';
import type { Payment } from '../types';

export default function Payments() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => payments.filter((p) =>
    (!search || p.orderId.toLowerCase().includes(search.toLowerCase()) || p.customerName.toLowerCase().includes(search.toLowerCase()) || p.gatewayRef.toLowerCase().includes(search.toLowerCase())) &&
    (!type || p.type === type) &&
    (!status || p.status === status)
  ), [search, type, status]);

  const totalCollected = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Payment ID' },
    { key: 'orderId', header: 'Order ID' },
    { key: 'customerName', header: 'Customer' },
    { key: 'tailorName', header: 'Tailor' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount', sortValue: (p) => p.amount, render: (p) => `₹${p.amount.toLocaleString('en-IN')}` },
    { key: 'method', header: 'Method' },
    { key: 'gatewayRef', header: 'Gateway Ref' },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'date', header: 'Date', sortValue: (p) => p.date },
  ];

  const hasFilters = search || type || status;

  return (
    <div>
      <PageHeader title="Payment Management" description="Advance, balance, refund and transaction records" />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-text-secondary">Total Collected</div><div className="mt-1 text-2xl font-bold text-navy">₹{totalCollected.toLocaleString('en-IN')}</div></Card>
        <Card><div className="text-sm text-text-secondary">Pending Payments</div><div className="mt-1 text-2xl font-bold text-warning">₹{totalPending.toLocaleString('en-IN')}</div></Card>
        <Card><div className="text-sm text-text-secondary">Total Refunded</div><div className="mt-1 text-2xl font-bold text-error">₹{totalRefunded.toLocaleString('en-IN')}</div></Card>
      </div>

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64"><Input placeholder="Search order, customer, ref..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="w-48"><Select placeholder="All Types" value={type} onChange={(e) => setType(e.target.value)} options={['Advance', 'Balance', 'Full Payment', 'Refund'].map((s) => ({ label: s, value: s }))} /></div>
          <div className="w-48"><Select placeholder="All Status" value={status} onChange={(e) => setStatus(e.target.value)} options={['Paid', 'Partial', 'Pending', 'Refunded', 'Failed'].map((s) => ({ label: s, value: s }))} /></div>
          {hasFilters && <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setType(''); setStatus(''); }}>Clear filters</Button>}
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} emptyTitle="No Payments Found" emptyDescription="Try adjusting your filters." />
      </Card>
    </div>
  );
}
