import { Link, useNavigate } from 'react-router-dom';
import { useStore, useCustomerBookings } from '@/store/useStore';
import { categories } from '@/data/seed';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Section from '@/customer/components/Section';
import TailorCard from '@/customer/components/TailorCard';
import logo from '@/assets/hello-tailor-logo.png';

export default function Home() {
  const navigate = useNavigate();
  const notifications = useStore((s) => s.notifications);
  const tailors = useStore((s) => s.tailors);
  const coupons = useStore((s) => s.coupons);
  const addresses = useStore((s) => s.addresses);
  const customerBookings = useCustomerBookings();

  const unread = notifications.filter((n) => n.audience === 'customer' && !n.read).length;
  const nearby = [...tailors].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  const topRated = [...tailors].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const featured = tailors.filter((t) => t.featured);
  const activeOffers = coupons.filter((c) => c.status === 'Active');
  const activeBooking = customerBookings.find((b) => !['Delivered', 'Cancelled', 'Rejected'].includes(b.status));
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-3 sm:px-6">
        <img src={logo} alt="Hello Tailor" className="h-10 w-10 object-contain" />
        <button className="flex flex-1 min-w-0 items-center gap-1 text-left" onClick={() => navigate('/customer/profile/addresses')}>
          <span>📍</span>
          <span className="truncate text-[13px] font-medium text-ht-text">
            {defaultAddress ? `${defaultAddress.label}, ${defaultAddress.city}` : 'Set your location'}
          </span>
          <span className="text-ht-text-secondary">▾</span>
        </button>
        <Link to="/customer/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ht-border bg-ht-card">
          🔔
          {unread > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ht-error" /> : null}
        </Link>
      </div>

      <button onClick={() => navigate('/customer/search')} className="mx-4 flex h-12 items-center gap-2 rounded-ht-search border border-ht-border bg-ht-card px-3.5 text-left sm:mx-6">
        <span className="text-ht-text-secondary">🔍</span>
        <span className="text-[14px] text-ht-text-secondary">Search tailors, categories, "blouse"...</span>
      </button>

      <button onClick={() => navigate('/customer/search')} className="mx-4 mt-4 flex items-center gap-4 rounded-ht-card bg-ht-navy p-5 text-left sm:mx-6">
        <div className="flex-1">
          <p className="text-[18px] font-semibold text-white">Perfect Fit, Delivered to Your Door</p>
          <p className="mt-1 text-[13px] text-white/80">Book trusted tailors near you in minutes</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2">
            <span className="text-[13px] font-semibold text-ht-navy">Book Now</span>
            <span className="text-ht-navy">→</span>
          </div>
        </div>
        <span className="text-6xl text-white/30">👕</span>
      </button>

      {activeBooking ? (
        <Link to="/customer/bookings">
          <Card className="mx-4 mt-4 sm:mx-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-ht-text-secondary">Track Your Order</p>
                <p className="text-[15px] font-semibold text-ht-text">{activeBooking.id}</p>
              </div>
              <Badge label={activeBooking.status} tone="info" />
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[13px] font-medium text-ht-ocean">
              <span>›</span> View live tracking
            </div>
          </Card>
        </Link>
      ) : null}

      <Section title="Categories">
        {categories.map((c) => (
          <Link key={c.id} to={`/customer/category?id=${c.id}`} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ht-info-bg text-xl">🧵</div>
            <span className="text-center text-[12px] text-ht-text">{c.name}</span>
          </Link>
        ))}
      </Section>

      <Section title="Nearby Tailors" actionTo="/customer/tailors">
        {nearby.map((t) => <TailorCard key={t.id} tailor={t} />)}
      </Section>

      <Section title="Top Rated" actionTo="/customer/tailors">
        {topRated.map((t) => <TailorCard key={t.id} tailor={t} />)}
      </Section>

      <Section title="Featured Tailors" actionTo="/customer/tailors">
        {featured.map((t) => <TailorCard key={t.id} tailor={t} />)}
      </Section>

      <Section title="Offers For You" actionTo="/customer/profile/offers">
        {activeOffers.map((o) => (
          <Card key={o.id} className="w-64 shrink-0 border border-ht-gold bg-ht-gold-light">
            <Badge label={o.discountType === 'Percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`} tone="gold" />
            <p className="mt-2 text-[15px] font-semibold text-ht-text">{o.title}</p>
            <p className="mt-1 text-[13px] text-ht-text-secondary">Code: {o.code}</p>
          </Card>
        ))}
      </Section>

      <Link to="/customer/profile/membership" className="mx-4 mt-8 flex items-center gap-3 rounded-ht-premium bg-ht-navy p-4 sm:mx-6">
        <span className="text-2xl">🎖️</span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-white">Hello Tailor Gold Membership</p>
          <p className="text-[12px] text-white/75">Free pickup, priority slots & up to 15% off</p>
        </div>
        <span className="text-white">›</span>
      </Link>

      <Section title="Popular Stitching Categories">
        <div className="flex flex-wrap gap-2.5 px-0">
          {categories.slice(3).map((c) => (
            <Link key={c.id} to={`/customer/category?id=${c.id}`} className="rounded-full border border-ht-border bg-ht-card px-4 py-2.5 text-[13px] font-medium text-ht-text">
              {c.name}
            </Link>
          ))}
        </div>
      </Section>
      <div className="h-6" />
    </div>
  );
}
