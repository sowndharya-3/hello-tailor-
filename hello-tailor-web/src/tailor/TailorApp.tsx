// Tailor role shell — 5 destinations (Dashboard/Bookings/Orders/Income/Profile) as a bottom tab
// bar below `sm`, a left sidebar at `sm:`+. Detail/sub-screens (booking/order detail, profile
// editors, membership, etc.) render full-width with their own ScreenHeader back button, and the
// bottom tab bar hides on mobile while one of those is open (matches the source app's stack-on-
// top-of-tabs navigation) — the sidebar stays put since desktop has room for both.
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Bookings from './bookings/Bookings';
import BookingDetail from './bookings/BookingDetail';
import Orders from './orders/Orders';
import OrderDetail from './orders/OrderDetail';
import OrderMeasurements from './orders/OrderMeasurements';
import OrderPhotos from './orders/OrderPhotos';
import Income from './income/Income';
import Profile from './profile/Profile';
import EditShopDetails from './profile/EditShopDetails';
import Location from './profile/Location';
import Hours from './profile/Hours';
import Categories from './profile/Categories';
import Pricing from './profile/Pricing';
import Photos from './profile/Photos';
import Settings from './profile/Settings';
import Membership from './membership/Membership';
import Advertise from './advertise/Advertise';
import Featured from './featured/Featured';
import Reviews from './reviews/Reviews';
import Notifications from './notifications/Notifications';
import { clsx } from '@/components/ui/clsx';

const TABS = [
  { to: '/tailor', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/tailor/bookings', label: 'Bookings', icon: '📅', end: false },
  { to: '/tailor/orders', label: 'Orders', icon: '🧾', end: false },
  { to: '/tailor/income', label: 'Income', icon: '📊', end: false },
  { to: '/tailor/profile', label: 'Profile', icon: '👤', end: false },
];

const TAB_ROOTS = ['/tailor', '/tailor/bookings', '/tailor/orders', '/tailor/income', '/tailor/profile'];

export default function TailorApp() {
  const location = useLocation();
  const onTabRoot = TAB_ROOTS.includes(location.pathname);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] sm:pl-56">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-ht-border bg-white p-4 sm:flex">
        <p className="mb-6 px-2 text-[15px] font-bold text-ht-navy">Hello Tailor</p>
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-ht-input px-3 py-2.5 text-[14px] font-medium transition-colors',
                  isActive ? 'bg-ht-info-bg text-ht-ocean' : 'text-ht-text-secondary hover:bg-ht-bg',
                )
              }
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 pb-16 sm:pb-0">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<OrderDetail />} />
          <Route path="order/:id/measurements" element={<OrderMeasurements />} />
          <Route path="order/:id/photos" element={<OrderPhotos />} />
          <Route path="income" element={<Income />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditShopDetails />} />
          <Route path="profile/location" element={<Location />} />
          <Route path="profile/hours" element={<Hours />} />
          <Route path="profile/categories" element={<Categories />} />
          <Route path="profile/pricing" element={<Pricing />} />
          <Route path="profile/photos" element={<Photos />} />
          <Route path="profile/settings" element={<Settings />} />
          <Route path="membership" element={<Membership />} />
          <Route path="advertise" element={<Advertise />} />
          <Route path="featured" element={<Featured />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </main>

      {onTabRoot && (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ht-border bg-white sm:hidden">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                  isActive ? 'text-ht-ocean' : 'text-ht-text-secondary',
                )
              }
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
