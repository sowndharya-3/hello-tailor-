import {
  Users, Scissors, UserCheck, ShoppingBag, CalendarClock, CheckCircle2,
  IndianRupee, Percent, Crown, Megaphone, AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, Legend,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import {
  dashboardStats, revenueTrend, orderTrend, customerGrowth, tailorGrowth, topCategories, topCities,
} from '../data/mockData';

function inr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Dashboard() {
  const s = dashboardStats;
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of Hello Tailor marketplace performance" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Customers" value={s.totalCustomers.toLocaleString('en-IN')} icon={<Users size={18} />} trend={8.2} />
        <StatCard label="Total Tailors" value={s.totalTailors.toLocaleString('en-IN')} icon={<Scissors size={18} />} trend={5.1} />
        <StatCard label="Active Tailors" value={s.activeTailors.toLocaleString('en-IN')} icon={<UserCheck size={18} />} trend={3.4} />
        <StatCard label="Total Orders" value={s.totalOrders.toLocaleString('en-IN')} icon={<ShoppingBag size={18} />} trend={12.6} />
        <StatCard label="Today's Orders" value={s.todayOrders.toString()} icon={<CalendarClock size={18} />} />
        <StatCard label="Completed Orders" value={s.completedOrders.toLocaleString('en-IN')} icon={<CheckCircle2 size={18} />} trend={6.7} />
        <StatCard label="Revenue" value={inr(s.revenue)} icon={<IndianRupee size={18} />} trend={9.8} gold />
        <StatCard label="Commission Earned" value={inr(s.commission)} icon={<Percent size={18} />} trend={4.3} />
        <StatCard label="Membership Income" value={inr(s.membershipIncome)} icon={<Crown size={18} />} trend={11.2} gold />
        <StatCard label="Advertisement Income" value={inr(s.advertisementIncome)} icon={<Megaphone size={18} />} trend={-2.1} />
        <StatCard label="Pending Complaints" value={s.pendingComplaints.toString()} icon={<AlertCircle size={18} />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0C7EBC" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0C7EBC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => inr(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#0C7EBC" fill="url(#rev)" strokeWidth={2.5} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Order Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={orderTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="orders" fill="#0C7EBC" radius={[6, 6, 0, 0]} name="Orders" />
              <Bar dataKey="cancelled" fill="#D92D20" radius={[6, 6, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#173B57" strokeWidth={2.5} dot={false} name="New Customers" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Tailor Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={tailorGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="tailors" stroke="#D9A441" strokeWidth={2.5} dot={false} name="New Tailors" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Top Categories</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean/10 text-xs font-bold text-ocean">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-text-primary">{c.name}</span>
                <span className="text-sm font-semibold text-navy">{c.orders.toLocaleString('en-IN')} orders</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Top Cities</h3>
          <div className="flex flex-col gap-3">
            {topCities.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-text-primary">{c.name}</span>
                <span className="text-sm font-semibold text-navy">{c.orders.toLocaleString('en-IN')} orders</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
