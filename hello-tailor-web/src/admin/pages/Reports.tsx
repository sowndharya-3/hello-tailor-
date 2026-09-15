// Sections 15-18 — Reports hub gains a real filter toolbar (period presets + custom date range),
// summary cards, a filtered order table, and a CSV export that respects the active filter. The
// four existing sub-report links (Sales/Tailor Income/App Income/Analytics) stay exactly as they
// were — this adds a top-level filterable overview above them, it doesn't replace anything.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Activity, Download, ArrowRight, ShoppingBag, CheckCircle2, XCircle, IndianRupee, Percent, Wallet, RotateCcw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable, { type Column } from '../components/ui/DataTable';
import DateRangePicker from '../components/ui/DateRangePicker';
import StatCard from '../components/ui/StatCard';
import { useStore } from '@/store/useStore';

const reportLinks = [
  { title: 'Sales Report', description: 'Daily, monthly and yearly sales performance with booking count and AOV.', icon: TrendingUp, path: '/admin/reports/sales' },
  { title: 'Tailor Income Reports', description: 'Gross earnings, commission and net earnings broken down by tailor.', icon: PieChart, path: '/admin/reports/tailor-income' },
  { title: 'App Income Reports', description: 'Platform income by source: commissions, memberships, ads and more.', icon: PieChart, path: '/admin/reports/app-income' },
  { title: 'Analytics', description: 'Registrations, retention, conversion and marketplace health metrics.', icon: Activity, path: '/admin/analytics' },
];

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // 0 = Sunday
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

type Preset = 'Today' | 'Yesterday' | 'This Week' | 'Last Week' | 'This Month' | 'Last Month' | 'This Year' | 'Last Year';

function presetRange(preset: Preset): { from: string; to: string } {
  const now = new Date();
  switch (preset) {
    case 'Today':
      return { from: toISODate(now), to: toISODate(now) };
    case 'Yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return { from: toISODate(y), to: toISODate(y) };
    }
    case 'This Week': {
      const start = startOfWeek(now);
      return { from: toISODate(start), to: toISODate(now) };
    }
    case 'Last Week': {
      const start = startOfWeek(now);
      start.setDate(start.getDate() - 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { from: toISODate(start), to: toISODate(end) };
    }
    case 'This Month':
      return { from: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)), to: toISODate(now) };
    case 'Last Month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: toISODate(start), to: toISODate(end) };
    }
    case 'This Year':
      return { from: toISODate(new Date(now.getFullYear(), 0, 1)), to: toISODate(now) };
    case 'Last Year':
      return { from: toISODate(new Date(now.getFullYear() - 1, 0, 1)), to: toISODate(new Date(now.getFullYear() - 1, 11, 31)) };
  }
}

const PRESETS: Preset[] = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'This Year', 'Last Year'];
const DEFAULT_PRESET: Preset = 'This Month';

function inRange(iso: string, from: string, to: string) {
  const d = iso.slice(0, 10);
  return d >= from && d <= to;
}

function csvEscape(value: string | number) {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function Reports() {
  const bookings = useStore((s) => s.bookings);
  const payments = useStore((s) => s.payments);
  const commissions = useStore((s) => s.commissions);

  const [activePreset, setActivePreset] = useState<Preset | null>(DEFAULT_PRESET);
  const initial = presetRange(DEFAULT_PRESET);
  const [draftFrom, setDraftFrom] = useState(initial.from);
  const [draftTo, setDraftTo] = useState(initial.to);
  const [appliedFrom, setAppliedFrom] = useState(initial.from);
  const [appliedTo, setAppliedTo] = useState(initial.to);

  const applyPreset = (preset: Preset) => {
    const range = presetRange(preset);
    setActivePreset(preset);
    setDraftFrom(range.from);
    setDraftTo(range.to);
    setAppliedFrom(range.from);
    setAppliedTo(range.to);
  };

  const applyCustom = () => {
    setActivePreset(null);
    setAppliedFrom(draftFrom);
    setAppliedTo(draftTo);
  };

  const reset = () => applyPreset(DEFAULT_PRESET);

  const filteredBookings = useMemo(
    () => bookings.filter((b) => inRange(b.bookingDate, appliedFrom, appliedTo)),
    [bookings, appliedFrom, appliedTo],
  );

  const rows = useMemo(() => {
    return filteredBookings.map((b) => {
      const payment = payments.find((p) => p.bookingId === b.id);
      const commission = commissions.find((c) => c.bookingId === b.id);
      return { booking: b, payment, commission };
    });
  }, [filteredBookings, payments, commissions]);

  const summary = useMemo(() => {
    const completed = filteredBookings.filter((b) => b.status === 'Delivered');
    const cancelled = filteredBookings.filter((b) => b.status === 'Cancelled');
    const revenue = filteredBookings.filter((b) => b.status !== 'Cancelled').reduce((sum, b) => sum + b.amount, 0);
    const commissionTotal = rows.reduce((sum, r) => sum + (r.commission?.commissionAmount ?? 0), 0);
    return {
      total: filteredBookings.length,
      completed: completed.length,
      cancelled: cancelled.length,
      revenue,
      commission: commissionTotal,
      tailorIncome: revenue - commissionTotal,
    };
  }, [filteredBookings, rows]);

  const exportCsv = () => {
    const header = ['Date', 'Order ID', 'Customer', 'Tailor', 'Order Status', 'Amount', 'Commission', 'Payment Status'];
    const lines = [header.map(csvEscape).join(',')];
    for (const { booking: b, payment, commission } of rows) {
      lines.push(
        [
          b.bookingDate.slice(0, 10),
          b.id,
          b.customerName,
          b.tailorName,
          b.status,
          b.amount,
          commission?.commissionAmount ?? 0,
          payment?.status ?? '—',
        ]
          .map(csvEscape)
          .join(','),
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hello-tailor-report-${appliedFrom}-to-${appliedTo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns: Column<(typeof rows)[number]>[] = [
    { key: 'date', header: 'Date', render: (r) => r.booking.bookingDate.slice(0, 10), sortValue: (r) => r.booking.bookingDate },
    { key: 'id', header: 'Order ID', render: (r) => r.booking.id },
    { key: 'customer', header: 'Customer', render: (r) => r.booking.customerName },
    { key: 'tailor', header: 'Tailor', render: (r) => r.booking.tailorName },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            r.booking.status === 'Delivered'
              ? 'bg-ht-success/10 text-ht-success'
              : r.booking.status === 'Cancelled'
                ? 'bg-ht-error/10 text-ht-error'
                : 'bg-ht-ocean/10 text-ht-ocean'
          }`}
        >
          {r.booking.status}
        </span>
      ),
    },
    { key: 'amount', header: 'Amount', render: (r) => `₹${r.booking.amount.toLocaleString('en-IN')}`, sortValue: (r) => r.booking.amount },
    { key: 'commission', header: 'Commission', render: (r) => `₹${(r.commission?.commissionAmount ?? 0).toLocaleString('en-IN')}` },
    { key: 'payment', header: 'Payment', render: (r) => r.payment?.status ?? '—' },
  ];

  return (
    <div>
      <PageHeader
        title="Reports Dashboard"
        description="Central hub for all Hello Tailor performance reports"
        actions={
          <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv}>
            Export CSV
          </Button>
        }
      />

      {/* Filter toolbar (Section 15) */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                activePreset === p
                  ? 'border-ht-ocean bg-ht-ocean text-white'
                  : 'border-ht-border bg-white text-ht-text hover:bg-ht-bg'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-ht-border pt-4">
          <div>
            <p className="mb-1 text-[12px] font-medium text-ht-text-secondary">Custom Date Range</p>
            <DateRangePicker
              from={draftFrom}
              to={draftTo}
              onChange={(from, to) => {
                setDraftFrom(from);
                setDraftTo(to);
              }}
            />
          </div>
          <Button variant="primary" onClick={applyCustom}>
            Apply Filter
          </Button>
          <Button variant="secondary" icon={<RotateCcw size={15} />} onClick={reset}>
            Reset
          </Button>
        </div>
        <p className="mt-3 text-[12.5px] text-ht-text-secondary">
          Showing {appliedFrom} to {appliedTo} · {summary.total} order{summary.total === 1 ? '' : 's'}
        </p>
      </Card>

      {/* Summary cards (Section 18) */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Orders" value={String(summary.total)} icon={<ShoppingBag size={18} />} />
        <StatCard label="Completed" value={String(summary.completed)} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Cancelled" value={String(summary.cancelled)} icon={<XCircle size={18} />} />
        <StatCard label="Revenue" value={`₹${summary.revenue.toLocaleString('en-IN')}`} icon={<IndianRupee size={18} />} gold />
        <StatCard label="Commission" value={`₹${summary.commission.toLocaleString('en-IN')}`} icon={<Percent size={18} />} />
        <StatCard label="Tailor Income" value={`₹${summary.tailorIncome.toLocaleString('en-IN')}`} icon={<Wallet size={18} />} />
      </div>

      <Card className="mb-8 p-0">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.booking.id}
          emptyTitle="No orders in this range"
          emptyDescription="Try a wider date range or a different preset."
          pageSize={8}
        />
      </Card>

      <h2 className="mb-3 text-base font-semibold text-ht-navy">Detailed Reports</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reportLinks.map((r) => (
          <Link key={r.path} to={r.path}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ht-ocean/10 text-ht-ocean"><r.icon size={20} /></div>
                <ArrowRight size={18} className="text-ht-text-secondary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ht-navy">{r.title}</h3>
              <p className="mt-1 text-sm text-ht-text-secondary">{r.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
