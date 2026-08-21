import { useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { commissionEntries } from '../data/mockData';
import type { CommissionEntry } from '../types';

export default function Commission() {
  const { show } = useToast();
  const [rate, setRate] = useState('12');
  const [premiumRate, setPremiumRate] = useState('8');
  const [tailorFilter, setTailorFilter] = useState('');
  const [period, setPeriod] = useState('');

  const filtered = useMemo(() => commissionEntries.filter((c) =>
    (!tailorFilter || c.tailorName.toLowerCase().includes(tailorFilter.toLowerCase())) &&
    (!period || c.period === period)
  ), [tailorFilter, period]);

  const totalCollected = commissionEntries.filter((c) => c.status === 'Collected').reduce((s, c) => s + c.commissionAmount, 0);
  const totalPending = commissionEntries.filter((c) => c.status === 'Pending').reduce((s, c) => s + c.commissionAmount, 0);
  const periods = Array.from(new Set(commissionEntries.map((c) => c.period))).sort();

  const columns: Column<CommissionEntry>[] = [
    { key: 'id', header: 'Commission ID' },
    { key: 'orderId', header: 'Order ID' },
    { key: 'tailorName', header: 'Tailor' },
    { key: 'orderAmount', header: 'Order Amount', sortValue: (c) => c.orderAmount, render: (c) => `₹${c.orderAmount.toLocaleString('en-IN')}` },
    { key: 'commissionRate', header: 'Rate', render: (c) => `${c.commissionRate}%` },
    { key: 'commissionAmount', header: 'Commission', sortValue: (c) => c.commissionAmount, render: (c) => `₹${c.commissionAmount.toLocaleString('en-IN')}` },
    { key: 'period', header: 'Period' },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Commission Management" description="Configure commission rates and review collected commission" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 mb-5">
        <Card className="xl:col-span-1">
          <h3 className="mb-4 text-base font-semibold text-navy">Commission Rate Settings</h3>
          <div className="flex flex-col gap-4">
            <Input label="Standard Commission Rate (%)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} hint="Applied to all standard-plan tailors" />
            <Input label="Premium / Diamond Member Rate (%)" type="number" value={premiumRate} onChange={(e) => setPremiumRate(e.target.value)} hint="Discounted rate for Premium & Diamond tailors" />
            <Button icon={<Save size={16} />} onClick={() => show('success', 'Commission rates updated successfully.')}>Save Settings</Button>
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-navy">Commission Collected</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-info-bg p-4"><div className="text-sm text-ocean font-medium">Total Collected</div><div className="mt-1 text-2xl font-bold text-navy">₹{totalCollected.toLocaleString('en-IN')}</div></div>
            <div className="rounded-xl bg-[#FFFAEB] p-4"><div className="text-sm text-warning font-medium">Pending Collection</div><div className="mt-1 text-2xl font-bold text-navy">₹{totalPending.toLocaleString('en-IN')}</div></div>
          </div>
        </Card>
      </div>

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64"><Input placeholder="Filter by tailor" value={tailorFilter} onChange={(e) => setTailorFilter(e.target.value)} /></div>
          <div className="w-48"><Select placeholder="All Periods" value={period} onChange={(e) => setPeriod(e.target.value)} options={periods.map((p) => ({ label: p, value: p }))} /></div>
          {(tailorFilter || period) && <Button variant="ghost" size="sm" onClick={() => { setTailorFilter(''); setPeriod(''); }}>Clear filters</Button>}
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(c) => c.id} emptyTitle="No Commission Records" />
      </Card>
    </div>
  );
}
