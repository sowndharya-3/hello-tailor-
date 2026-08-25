import { useMemo } from 'react';
import {
  Users, UserCheck, ShoppingBag, TrendingUp, IndianRupee, Percent, Crown, Megaphone, Repeat, CheckCircle2, XCircle,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import { LineChart } from '@/components/ui/Chart';
import { useStore } from '@/store/useStore';
import { formatMoney } from '../lib/helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Analytics() {
  const bookings = useStore((s) => s.bookings);
  const customers = useStore((s) => s.customers);
  const tailors = useStore((s) => s.tailors);
  const commissions = useStore((s) => s.commissions);
  const advertisements = useStore((s) => s.advertisements);

  const stats = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
    const recentBookings = bookings.filter((b) => new Date(b.requestedAt).getTime() >= cutoff);
    const recentCustomers = customers.filter((c) => new Date(c.joinedDate).getTime() >= cutoff);
    const revenue30d = recentBookings.reduce((s, b) => s + b.amount, 0);
    const commission30d = commissions.filter((c) => new Date(c.date).getTime() >= cutoff).reduce((s, c) => s + c.commissionAmount, 0);
    const completed = bookings.filter((b) => b.status === 'Delivered').length;
    const cancelled = bookings.filter((b) => b.status === 'Cancelled').length;
    const repeatCustomers = customers.filter((c) => c.ordersCount > 1).length;
    return {
      registrations30d: recentCustomers.length,
      activeCustomers: customers.filter((c) => c.status === 'Active').length,
      activeTailors: tailors.filter((t) => t.status === 'Active').length,
      bookings30d: recentBookings.length,
      conversionRate: bookings.length ? ((completed / bookings.length) * 100).toFixed(1) : '0.0',
      revenue30d, commission30d,
      membershipCount: tailors.filter((t) => t.membership !== 'None').length + customers.filter((c) => c.membership !== 'None').length,
      adImpressions: advertisements.filter((a) => a.status === 'Active').length * 45000,
      repeatRate: customers.length ? ((repeatCustomers / customers.length) * 100).toFixed(1) : '0.0',
      completed, cancelled,
    };
  }, [bookings, customers, tailors, commissions, advertisements]);

  const growth = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1));
    return {
      labels: months.map((d) => MONTHS[d.getMonth()]),
      customers: months.map((d) => customers.filter((c) => { const cd = new Date(c.joinedDate); return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth(); }).length),
      tailors: months.map((d) => tailors.filter((t) => { const td = new Date(t.joinedDate); return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth(); }).length),
    };
  }, [customers, tailors]);

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
      <PageHeader title="Analytics" description="Marketplace health, growth and engagement metrics" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Registrations (30d)" value={stats.registrations30d.toLocaleString('en-IN')} icon={<Users size={18} />} />
        <StatCard label="Active Customers" value={stats.activeCustomers.toLocaleString('en-IN')} icon={<UserCheck size={18} />} />
        <StatCard label="Active Tailors" value={stats.activeTailors.toLocaleString('en-IN')} icon={<UserCheck size={18} />} />
        <StatCard label="Bookings (30d)" value={stats.bookings30d.toLocaleString('en-IN')} icon={<ShoppingBag size={18} />} />
        <StatCard label="Completion Rate" value={`${stats.conversionRate}%`} icon={<TrendingUp size={18} />} />
        <StatCard label="Revenue (30d)" value={formatMoney(stats.revenue30d)} icon={<IndianRupee size={18} />} gold />
        <StatCard label="Commission (30d)" value={formatMoney(stats.commission30d)} icon={<Percent size={18} />} />
        <StatCard label="Active Memberships" value={stats.membershipCount.toLocaleString('en-IN')} icon={<Crown size={18} />} gold />
        <StatCard label="Ad Impressions (est.)" value={stats.adImpressions.toLocaleString('en-IN')} icon={<Megaphone size={18} />} />
        <StatCard label="Repeat Customer Rate" value={`${stats.repeatRate}%`} icon={<Repeat size={18} />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Customer Growth (6 months)</h3>
          <LineChart data={growth.customers} width={480} height={200} color="#0C7EBC" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{growth.labels.map((l) => <span key={l}>{l}</span>)}</div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Tailor Growth (6 months)</h3>
          <LineChart data={growth.tailors} width={480} height={200} color="#D9A441" />
          <div className="mt-2 flex justify-between text-xs text-ht-text-secondary">{growth.labels.map((l) => <span key={l}>{l}</span>)}</div>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="mb-4 text-base font-semibold text-ht-navy">Order Completion vs Cancellation</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-medium text-ht-text">Completed</span>
            <div className="h-3 flex-1 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-ht-success" style={{ width: `${(stats.completed / Math.max(1, stats.completed + stats.cancelled)) * 100}%` }} /></div>
            <span className="w-16 text-right text-sm font-semibold text-ht-navy">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm font-medium text-ht-text">Cancelled</span>
            <div className="h-3 flex-1 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-ht-error" style={{ width: `${(stats.cancelled / Math.max(1, stats.completed + stats.cancelled)) * 100}%` }} /></div>
            <span className="w-16 text-right text-sm font-semibold text-ht-navy">{stats.cancelled}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-around text-sm">
          <span className="flex items-center gap-1.5 font-medium text-ht-success"><CheckCircle2 size={14} /> {stats.completed.toLocaleString('en-IN')} Completed</span>
          <span className="flex items-center gap-1.5 font-medium text-ht-error"><XCircle size={14} /> {stats.cancelled.toLocaleString('en-IN')} Cancelled</span>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Top Performing Categories</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-medium text-ht-text">{c.name}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-ht-ocean" style={{ width: `${(c.orders / topCategories[0].orders) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-ht-navy">{c.orders.toLocaleString('en-IN')}</span>
              </div>
            ))}
            {topCategories.length === 0 && <p className="text-sm text-ht-text-secondary">No bookings yet.</p>}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Top Performing Locations</h3>
          <div className="flex flex-col gap-3">
            {topCities.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-medium text-ht-text">{c.name}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-ht-gold" style={{ width: `${(c.orders / topCities[0].orders) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-ht-navy">{c.orders.toLocaleString('en-IN')}</span>
              </div>
            ))}
            {topCities.length === 0 && <p className="text-sm text-ht-text-secondary">No bookings yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
