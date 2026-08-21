import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable, { type Column } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { tailors } from '../data/mockData';
import type { Tailor } from '../types';

interface Row extends Tailor {
  grossEarnings: number;
  netEarnings: number;
  period: string;
}

export default function TailorIncomeReport() {
  const { show } = useToast();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('This Month');

  const rows: Row[] = useMemo(() => tailors.map((t) => ({
    ...t, grossEarnings: t.income, netEarnings: t.income - t.commissionPaid, period: '2026-08',
  })), []);

  const filtered = rows.filter((r) => !search || r.shopName.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<Row>[] = [
    { key: 'shopName', header: 'Tailor', sortValue: (r) => r.shopName },
    { key: 'city', header: 'City' },
    { key: 'orders', header: 'Bookings', sortValue: (r) => r.orders },
    { key: 'grossEarnings', header: 'Gross Earnings', sortValue: (r) => r.grossEarnings, render: (r) => `₹${r.grossEarnings.toLocaleString('en-IN')}` },
    { key: 'commissionPaid', header: 'Commission', sortValue: (r) => r.commissionPaid, render: (r) => `₹${r.commissionPaid.toLocaleString('en-IN')}` },
    { key: 'netEarnings', header: 'Net Earnings', sortValue: (r) => r.netEarnings, render: (r) => <span className="font-semibold text-navy">₹{r.netEarnings.toLocaleString('en-IN')}</span> },
  ];

  const totalGross = rows.reduce((s, r) => s + r.grossEarnings, 0);
  const totalNet = rows.reduce((s, r) => s + r.netEarnings, 0);

  return (
    <div>
      <PageHeader title="Tailor Income Reports" description="Per-tailor earnings breakdown" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={() => show('info', 'Preparing export... (UI demo)')}>Export</Button>} />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><div className="text-sm text-text-secondary">Total Gross Earnings</div><div className="mt-1 text-2xl font-bold text-navy">₹{totalGross.toLocaleString('en-IN')}</div></Card>
        <Card><div className="text-sm text-text-secondary">Total Net Earnings (After Commission)</div><div className="mt-1 text-2xl font-bold text-navy">₹{totalNet.toLocaleString('en-IN')}</div></Card>
      </div>

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64"><Input placeholder="Search tailor" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="w-48"><Select value={period} onChange={(e) => setPeriod(e.target.value)} options={['This Month', 'Last Month', 'This Quarter', 'This Year'].map((p) => ({ label: p, value: p }))} /></div>
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} emptyTitle="No Income Records" />
      </Card>
    </div>
  );
}
