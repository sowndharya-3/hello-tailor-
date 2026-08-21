import { useState } from 'react';
import { Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useToast } from '../components/ui/Toast';
import { revenueTrend, orderTrend } from '../data/mockData';

const daily = Array.from({ length: 14 }, (_, i) => ({ day: `Aug ${8 + i}`, sales: Math.round(30000 + Math.random() * 70000), bookings: Math.round(20 + Math.random() * 60) }));

export default function SalesReport() {
  const { show } = useToast();
  const [range, setRange] = useState('Daily');

  const chartData = range === 'Daily' ? daily : range === 'Monthly' ? revenueTrend.map((r) => ({ day: r.month, sales: r.revenue })) : [
    { day: '2023', sales: 42000000 }, { day: '2024', sales: 58000000 }, { day: '2025', sales: 71000000 }, { day: '2026', sales: 84200000 },
  ];

  const totalBookings = orderTrend.reduce((s, o) => s + o.orders, 0);
  const avgOrderValue = 3240;

  return (
    <div>
      <PageHeader
        title="Sales Report"
        description="Track sales performance across time periods"
        actions={<Button variant="secondary" icon={<Download size={16} />} onClick={() => show('info', 'Preparing export... (UI demo)')}>Export Report</Button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-text-secondary">Total Bookings</div><div className="mt-1 text-2xl font-bold text-navy">{totalBookings.toLocaleString('en-IN')}</div></Card>
        <Card><div className="text-sm text-text-secondary">Average Order Value</div><div className="mt-1 text-2xl font-bold text-navy">₹{avgOrderValue.toLocaleString('en-IN')}</div></Card>
        <Card className="bg-gold-light border-gold/30"><div className="text-sm text-gold font-medium">Total Sales (YTD)</div><div className="mt-1 text-2xl font-bold text-navy">₹84.2L</div></Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-navy">Sales Trend</h3>
          <SegmentedControl options={['Daily', 'Monthly', 'Yearly']} active={range} onChange={setRange} />
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
            <Bar dataKey="sales" fill="#0C7EBC" radius={[6, 6, 0, 0]} name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mt-5">
        <h3 className="mb-4 text-base font-semibold text-navy">Booking Volume</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={orderTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#D9A441" strokeWidth={2.5} dot={false} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
