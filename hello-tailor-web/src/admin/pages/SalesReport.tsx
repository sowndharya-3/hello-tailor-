import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import { BarChart, LineChart } from '@/components/ui/Chart';
import { formatMoney } from '../lib/helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SalesReport() {
  const { show } = useToast();
  const bookings = useStore((s) => s.bookings);
  const [range, setRange] = useState('Daily');

  const { labels, values } = useMemo(() => {
    if (range === 'Daily') {
      const now = new Date();
      const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - (13 - i)); return d; });
      return {
        labels: days.map((d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`),
        values: days.map((d) => bookings.filter((b) => new Date(b.bookingDate).toDateString() === d.toDateString()).reduce((s, b) => s + b.amount, 0)),
      };
    }
    if (range === 'Monthly') {
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1));
      return {
        labels: months.map((d) => MONTHS[d.getMonth()]),
        values: months.map((d) => bookings.filter((b) => { const bd = new Date(b.bookingDate); return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth(); }).reduce((s, b) => s + b.amount, 0)),
      };
    }
    const years = Array.from(new Set(bookings.map((b) => new Date(b.bookingDate).getFullYear()))).sort();
    return {
      labels: years.map(String),
      values: years.map((y) => bookings.filter((b) => new Date(b.bookingDate).getFullYear() === y).reduce((s, b) => s + b.amount, 0)),
    };
  }, [bookings, range]);

  const totalBookings = bookings.length;
  const totalSales = bookings.reduce((s, b) => s + b.amount, 0);
  const avgOrderValue = totalBookings ? Math.round(totalSales / totalBookings) : 0;

  const monthlyOrderCounts = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1));
    return months.map((d) => bookings.filter((b) => { const bd = new Date(b.bookingDate); return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth(); }).length);
  }, [bookings]);

  return (
    <div>
      <PageHeader
        title="Sales Report"
        description="Track sales performance across time periods"
        actions={<Button variant="secondary" icon={<Download size={16} />} onClick={() => show('info', 'Preparing export... (UI demo)')}>Export Report</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-ht-text-secondary">Total Bookings</div><div className="mt-1 text-2xl font-bold text-ht-navy">{totalBookings.toLocaleString('en-IN')}</div></Card>
        <Card><div className="text-sm text-ht-text-secondary">Average Order Value</div><div className="mt-1 text-2xl font-bold text-ht-navy">{formatMoney(avgOrderValue)}</div></Card>
        <Card className="bg-ht-gold-light border-ht-gold/30"><div className="text-sm text-ht-gold font-medium">Total Sales</div><div className="mt-1 text-2xl font-bold text-ht-navy">{formatMoney(totalSales)}</div></Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ht-navy">Sales Trend</h3>
          <SegmentedControl options={['Daily', 'Monthly', 'Yearly']} active={range} onChange={setRange} />
        </div>
        <BarChart data={values} width={560} height={260} color="#0C7EBC" />
        <div className="mt-2 flex justify-between text-xs text-ht-text-secondary overflow-x-auto">{labels.map((l) => <span key={l} className="px-1">{l}</span>)}</div>
      </Card>

      <Card className="mt-5">
        <h3 className="mb-4 text-base font-semibold text-ht-navy">Booking Volume (last 6 months)</h3>
        <LineChart data={monthlyOrderCounts} width={560} height={220} color="#D9A441" />
      </Card>
    </div>
  );
}
