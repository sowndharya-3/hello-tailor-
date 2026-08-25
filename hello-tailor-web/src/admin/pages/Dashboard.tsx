import { useMemo } from 'react';
import {
  Users, Scissors, UserCheck, ShoppingBag, CalendarClock, CheckCircle2,
  IndianRupee, Percent, Crown, Megaphone, AlertCircle,
} from 'lucide-react';
import { BarChart, LineChart } from '@/components/ui/Chart';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '@/store/useStore';
import { formatMoney } from '../lib/helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ponytail: no time-series table exists in the store, so trends are derived on the fly
// from booking/join dates bucketed by month — real data, just computed instead of stored.
function last6MonthBuckets() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()] };
  });
}

export default function Dashboard() {
  const bookings = useStore((s) => s.bookings);
  const customers = useStore((s) => s.customers);
  const tailors = useStore((s) => s.tailors);
  const commissions = useStore((s) => s.commissions);
  const complaints = useStore((s) => s.complaints);
  const advertisements = useStore((s) => s.advertisements);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const commission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const today = new Date().toDateString();
    return {
      totalCustomers: customers.length,
      totalTailors: tailors.length,
      activeTailors: tailors.filter((t) => t.status === 'Active').length,
      totalOrders: bookings.length,
      todayOrders: bookings.filter((b) => new Date(b.requestedAt).toDateString() === today).length,
      completedOrders: bookings.filter((b) => b.status === 'Delivered').length,
      revenue,
      commission,
      membershipIncome: tailors.filter((t) => t.membership !== 'None').length * 999,
      advertisementIncome: advertisements.filter((a) => a.status === 'Active').length * 4500,
      pendingComplaints: complaints.filter((c) => c.status === 'Open').length,
    };
  }, [bookings, customers, tailors, commissions, complaints, advertisements]);

  const buckets = useMemo(() => last6MonthBuckets(), []);
  const revenueTrend = useMemo(() => buckets.map((b) => {
    const [y, m] = b.key.split('-').map(Number);
    return bookings.filter((bk) => { const d = new Date(bk.bookingDate); return d.getFullYear() === y && d.getMonth() === m; })
      .reduce((sum, bk) => sum + bk.amount, 0);
  }), [buckets, bookings]);
  const orderTrend = useMemo(() => buckets.map((b) => {
    const [y, m] = b.key.split('-').map(Number);
    return bookings.filter((bk) => { const d = new Date(bk.bookingDate); return d.getFullYear() === y && d.getMonth() === m; }).length;
  }), [buckets, bookings]);
  const customerGrowth = useMemo(() => buckets.map((b) => {
    const [y, m] = b.key.split('-').map(Number);
    return customers.filter((c) => { const d = new Date(c.joinedDate); return d.getFullYear() === y && d.getMonth() === m; }).length;
  }), [buckets, customers]);
  const tailorGrowth = useMemo(() => buckets.map((b) => {
    const [y, m] = b.key.split('-').map(Number);
    return tailors.filter((t) => { const d = new Date(t.joinedDate); return d.getFullYear() === y && d.getMonth() === m; }).length;
  }), [buckets, tailors]);

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((b) => counts.set(b.category, (counts.get(b.category) ?? 0) + 1));
    return [...counts.entries()].map(([name, orders]) => ({ name, orders })).sort((a, b) => b.orders - a.orders).slice(0, 6);
  }, [bookings]);
  const topCities = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((b) => counts.set(b.city, (counts.get(b.city) ?? 0) + 1));
    return [...counts.entries()].map(([name, orders]) => ({ name, orders })).sort((a, b) => b.orders - a.orders).slice(0, 6);
  }, [bookings]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of Hello Tailor marketplace performance" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Customers" value={stats.totalCustomers.toLocaleString('en-IN')} icon={<Users size={18} />} />
        <StatCard label="Total Tailors" value={stats.totalTailors.toLocaleString('en-IN')} icon={<Scissors size={18} />} />
        <StatCard label="Active Tailors" value={stats.activeTailors.toLocaleString('en-IN')} icon={<UserCheck size={18} />} />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString('en-IN')} icon={<ShoppingBag size={18} />} />
        <StatCard label="Today's Orders" value={stats.todayOrders.toString()} icon={<CalendarClock size={18} />} />
        <StatCard label="Completed Orders" value={stats.completedOrders.toLocaleString('en-IN')} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Revenue" value={formatMoney(stats.revenue)} icon={<IndianRupee size={18} />} gold />
        <StatCard label="Commission Earned" value={formatMoney(stats.commission)} icon={<Percent size={18} />} />
        <StatCard label="Membership Income" value={formatMoney(stats.membershipIncome)} icon={<Crown size={18} />} gold />
        <StatCard label="Advertisement Income" value={formatMoney(stats.advertisementIncome)} icon={<Megaphone size={18} />} />
        <StatCard label="Pending Complaints" value={stats.pendingComplaints.toString()} icon={<AlertCircle size={18} />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Revenue Trend</h3>
          <BarChart data={revenueTrend} width={480} height={220} color="#0C7EBC" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{buckets.map((b) => <span key={b.key}>{b.label}</span>)}</div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Order Trend</h3>
          <BarChart data={orderTrend} width={480} height={220} color="#173B57" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{buckets.map((b) => <span key={b.key}>{b.label}</span>)}</div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Customer Growth</h3>
          <LineChart data={customerGrowth} width={480} height={200} color="#173B57" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{buckets.map((b) => <span key={b.key}>{b.label}</span>)}</div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Tailor Growth</h3>
          <LineChart data={tailorGrowth} width={480} height={200} color="#D9A441" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{buckets.map((b) => <span key={b.key}>{b.label}</span>)}</div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Top Categories</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ht-ocean/10 text-xs font-bold text-ht-ocean">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-ht-text">{c.name}</span>
                <span className="text-sm font-semibold text-ht-navy">{c.orders.toLocaleString('en-IN')} orders</span>
              </div>
            ))}
            {topCategories.length === 0 && <p className="text-sm text-ht-text-secondary">No bookings yet.</p>}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Top Cities</h3>
          <div className="flex flex-col gap-3">
            {topCities.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ht-gold/15 text-xs font-bold text-ht-gold">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-ht-text">{c.name}</span>
                <span className="text-sm font-semibold text-ht-navy">{c.orders.toLocaleString('en-IN')} orders</span>
              </div>
            ))}
            {topCities.length === 0 && <p className="text-sm text-ht-text-secondary">No bookings yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
