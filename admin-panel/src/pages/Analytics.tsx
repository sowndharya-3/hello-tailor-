import {
  Users, UserCheck, ShoppingBag, TrendingUp, IndianRupee, Percent, Crown, Megaphone, Repeat, CheckCircle2, XCircle,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import {
  customerGrowth, tailorGrowth, orderTrend, topCategories, topCities, dashboardStats,
} from '../data/mockData';

export default function Analytics() {
  const completed = orderTrend.reduce((s, o) => s + o.orders - o.cancelled, 0);
  const cancelled = orderTrend.reduce((s, o) => s + o.cancelled, 0);
  const completionData = [
    { name: 'Completed', value: completed },
    { name: 'Cancelled', value: cancelled },
  ];

  return (
    <div>
      <PageHeader title="Analytics" description="Marketplace health, growth and engagement metrics" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Registrations (30d)" value="2,140" icon={<Users size={18} />} trend={14.2} />
        <StatCard label="Active Customers" value="9,860" icon={<UserCheck size={18} />} trend={5.6} />
        <StatCard label="Active Tailors" value={dashboardStats.activeTailors.toLocaleString('en-IN')} icon={<UserCheck size={18} />} trend={3.1} />
        <StatCard label="Bookings (30d)" value="6,420" icon={<ShoppingBag size={18} />} trend={9.4} />
        <StatCard label="Conversion Rate" value="4.8%" icon={<TrendingUp size={18} />} trend={1.2} />
        <StatCard label="Revenue (30d)" value="₹18.4L" icon={<IndianRupee size={18} />} trend={7.9} gold />
        <StatCard label="Commission (30d)" value="₹2.2L" icon={<Percent size={18} />} trend={6.3} />
        <StatCard label="Membership Growth" value="+340" icon={<Crown size={18} />} trend={22.1} gold />
        <StatCard label="Ad Impressions" value="1.2M" icon={<Megaphone size={18} />} trend={-3.4} />
        <StatCard label="Repeat Order Rate" value="38.6%" icon={<Repeat size={18} />} trend={2.8} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Customer vs Tailor Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={customerGrowth.map((c, i) => ({ month: c.month, customers: c.customers, tailors: tailorGrowth[i].tailors }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#0C7EBC" strokeWidth={2.5} dot={false} name="Customers" />
              <Line type="monotone" dataKey="tailors" stroke="#D9A441" strokeWidth={2.5} dot={false} name="Tailors" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Order Completion vs Cancellation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={completionData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: '#1F2937' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {completionData.map((d, i) => <Cell key={d.name} fill={i === 0 ? '#22A06B' : '#D92D20'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex justify-around text-sm">
            <span className="flex items-center gap-1.5 font-medium text-success"><CheckCircle2 size={14} /> {completed.toLocaleString('en-IN')} Completed</span>
            <span className="flex items-center gap-1.5 font-medium text-error"><XCircle size={14} /> {cancelled.toLocaleString('en-IN')} Cancelled</span>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Top Performing Categories</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-medium text-text-primary">{c.name}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-ocean" style={{ width: `${(c.orders / topCategories[0].orders) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-navy">{c.orders.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Top Performing Locations</h3>
          <div className="flex flex-col gap-3">
            {topCities.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-medium text-text-primary">{c.name}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gold" style={{ width: `${(c.orders / topCities[0].orders) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-navy">{c.orders.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
