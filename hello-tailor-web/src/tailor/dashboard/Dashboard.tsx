// Ported from hello-tailor-app/app/(tailor)/(tabs)/index.tsx.
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { LineChart } from '@/components/ui/Chart';
import { useStore, useMyTailor, useMyBookings } from '@/store/useStore';
import MetricCard from '../components/MetricCard';
import { formatCurrency } from '../lib/status';
import logo from '@/assets/hello-tailor-logo.png';

export default function Dashboard() {
  const tailor = useMyTailor();
  const toggleOnline = useStore((s) => s.toggleOnline);
  const bookings = useMyBookings();
  const notifications = useStore(useShallow((s) => s.notifications.filter((n) => n.audience === 'tailor')));
  const reviews = useStore(useShallow((s) => s.reviews.filter((r) => r.tailorId === s.myTailorId)));
  const unread = notifications.filter((n) => !n.read).length;
  const navigate = useNavigate();

  const requested = bookings.filter((b) => b.status === 'Requested');
  const today = new Date().toDateString();
  const todayOrders = bookings.filter((b) => new Date(b.deliveryDate).toDateString() === today && b.status !== 'Rejected' && b.status !== 'Cancelled');
  const pending = bookings.filter((b) => !['Requested', 'Delivered', 'Rejected', 'Cancelled'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'Delivered');
  const pendingDelivery = bookings.filter((b) => b.status === 'Ready');
  const todayIncome = (completed.reduce((sum, b) => sum + b.amount, 0) % 5000) + 1200;

  return (
    <div className="pb-10">
      <div className="rounded-b-[24px] bg-ht-navy px-5 pb-8 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Hello Tailor" className="h-7 w-auto object-contain" />
          <button
            onClick={() => navigate('/tailor/notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ht-error px-1 text-[9px] font-semibold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Link to="/tailor/profile" className="flex min-w-0 flex-1 items-center gap-3">
            <img src={tailor.image} alt="" className="h-11 w-11 shrink-0 rounded-full border-2 border-white/40 object-cover" />
            <div className="min-w-0">
              <p className="font-semibold text-white">Hi, {tailor.name.split(' ')[0]} 👋</p>
              <p className="truncate text-[12px] text-[#C9D8E3]">{tailor.shopName}</p>
            </div>
          </Link>
          <label className="flex shrink-0 flex-col items-center gap-1">
            <span className="text-[11px] font-medium text-white">{tailor.online ? 'Online' : 'Offline'}</span>
            <button
              onClick={toggleOnline}
              className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${tailor.online ? 'justify-end bg-ht-success' : 'justify-start bg-white/20'}`}
              aria-label="Toggle online status"
            >
              <span className="h-5 w-5 rounded-full bg-white shadow" />
            </button>
          </label>
        </div>
      </div>

      <div className="px-5 pt-6 sm:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard label="New Bookings" value={String(requested.length)} icon="📅" tone="ocean" onClick={() => navigate('/tailor/bookings')} />
          <MetricCard label="Today Orders" value={String(todayOrders.length)} icon="📆" tone="navy" onClick={() => navigate('/tailor/orders')} />
          <MetricCard label="Pending Orders" value={String(pending.length)} icon="⏳" tone="gold" onClick={() => navigate('/tailor/orders')} />
          <MetricCard label="Completed" value={String(completed.length)} icon="✅" tone="success" onClick={() => navigate('/tailor/orders')} />
        </div>
        <div className="mt-3">
          <MetricCard label="Today's Income" value={formatCurrency(todayIncome)} icon="💰" tone="gold" onClick={() => navigate('/tailor/income')} wide />
        </div>

        <SectionHeader title="New Booking Requests" to="/tailor/bookings" />
        {requested.length === 0 ? (
          <Card><p className="text-[13px] text-ht-text-secondary">No new booking requests right now.</p></Card>
        ) : (
          <div className="flex flex-col gap-3">
            {requested.slice(0, 3).map((b) => (
              <Link key={b.id} to={`/tailor/booking/${b.id}`}>
                <Card className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ht-text">{b.customerName}</p>
                    <p className="text-[12px] text-ht-text-secondary">{b.category} · {formatCurrency(b.amount)}</p>
                  </div>
                  <Badge label="New" tone="info" />
                </Card>
              </Link>
            ))}
          </div>
        )}

        <SectionHeader title="Today's Schedule" to="/tailor/orders" />
        {todayOrders.length === 0 ? (
          <Card><p className="text-[13px] text-ht-text-secondary">Nothing scheduled for delivery today.</p></Card>
        ) : (
          <div className="flex flex-col gap-3">
            {todayOrders.slice(0, 3).map((b) => (
              <Link key={b.id} to={`/tailor/order/${b.id}`}>
                <Card className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ht-text">{b.customerName} · {b.category}</p>
                    <p className="text-[12px] text-ht-text-secondary">Due today</p>
                  </div>
                  <Badge label={b.status} tone="warning" />
                </Card>
              </Link>
            ))}
          </div>
        )}

        <SectionHeader title="Pending Delivery" to="/tailor/orders" />
        {pendingDelivery.length === 0 ? (
          <Card><p className="text-[13px] text-ht-text-secondary">No orders waiting for handover.</p></Card>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingDelivery.slice(0, 3).map((b) => (
              <Link key={b.id} to={`/tailor/order/${b.id}`}>
                <Card className="flex items-center justify-between">
                  <p className="font-semibold text-ht-text">{b.customerName}</p>
                  <Badge label="Ready" tone="success" />
                </Card>
              </Link>
            ))}
          </div>
        )}

        <SectionHeader title="Income Overview" to="/tailor/income" />
        <Card>
          <p className="text-[24px] font-bold text-ht-text">{formatCurrency(todayIncome * 6)}</p>
          <p className="text-[12px] text-ht-text-secondary">Last 7 days</p>
          <div className="mt-3 flex justify-center">
            <LineChart data={[1200, 1800, 900, 2400, 1600, 2100, todayIncome]} width={280} height={80} />
          </div>
        </Card>

        <SectionHeader title="Recent Reviews" to="/tailor/reviews" />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {reviews.slice(0, 4).map((r) => (
            <Card key={r.id} className="w-[220px] shrink-0">
              <div className="flex items-center gap-1.5">
                <img src={r.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                <p className="truncate font-semibold text-ht-text">{r.customerName}</p>
              </div>
              <div className="mt-1"><StarRating rating={r.rating} size={13} /></div>
              <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-ht-text-secondary">{r.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-[18px] font-semibold text-ht-text">{title}</h2>
      <Link to={to} className="text-[13px] font-medium text-ht-ocean">See all</Link>
    </div>
  );
}
