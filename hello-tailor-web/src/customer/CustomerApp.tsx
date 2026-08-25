import { Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

import Home from '@/customer/home/Home';
import Search from '@/customer/search/Search';
import CategoryBrowse from '@/customer/search/CategoryBrowse';
import Tailors from '@/customer/tailors/Tailors';
import TailorProfile from '@/customer/tailor/TailorProfile';
import TailorReviews from '@/customer/tailor/TailorReviews';
import Bookings from '@/customer/bookings/Bookings';
import Notifications from '@/customer/notifications/Notifications';

import BookingCategory from '@/customer/booking/Category';
import BookingPerson from '@/customer/booking/Person';
import ClothDetails from '@/customer/booking/ClothDetails';
import DesignUpload from '@/customer/booking/DesignUpload';
import MeasurementStep from '@/customer/booking/Measurement';
import MeasurementHistory from '@/customer/booking/MeasurementHistory';
import BookingDate from '@/customer/booking/BookingDate';
import DeliveryDate from '@/customer/booking/DeliveryDate';
import Method from '@/customer/booking/Method';
import Notes from '@/customer/booking/Notes';
import Summary from '@/customer/booking/Summary';
import BookingPayment from '@/customer/booking/Payment';
import Processing from '@/customer/booking/Processing';
import BookingSuccess from '@/customer/booking/Success';

import OrderTracking from '@/customer/order/OrderTracking';
import BalancePayment from '@/customer/order/BalancePayment';
import Invoice from '@/customer/order/Invoice';
import Reorder from '@/customer/order/Reorder';

import Profile from '@/customer/profile/Profile';
import Addresses from '@/customer/profile/Addresses';
import AddAddress from '@/customer/profile/AddAddress';
import Family from '@/customer/profile/Family';
import AddFamilyMember from '@/customer/profile/AddFamilyMember';
import Measurements from '@/customer/profile/Measurements';
import AddMeasurement from '@/customer/profile/AddMeasurement';
import Wallet from '@/customer/profile/Wallet';
import Loyalty from '@/customer/profile/Loyalty';
import Membership from '@/customer/profile/Membership';
import Referral from '@/customer/profile/Referral';
import Offers from '@/customer/profile/Offers';
import Complaints from '@/customer/profile/Complaints';
import NewComplaint from '@/customer/profile/NewComplaint';
import ComplaintDetail from '@/customer/profile/ComplaintDetail';
import Support from '@/customer/profile/Support';
import SupportChat from '@/customer/profile/SupportChat';
import LanguageScreen from '@/customer/profile/Language';

import MaterialStore from '@/customer/store/MaterialStore';
import MaterialDetail from '@/customer/store/MaterialDetail';
import Cart from '@/customer/store/Cart';
import ReadymadeStore from '@/customer/store/ReadymadeStore';
import ReadymadeDetail from '@/customer/store/ReadymadeDetail';

import AIDesign from '@/customer/ai-design/AIDesign';

const TABS = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/customer/tailors', label: 'Tailors', icon: '✂️', end: false },
  { to: '/customer/bookings', label: 'Bookings', icon: '📅', end: false },
  { to: '/customer/notifications', label: 'Alerts', icon: '🔔', end: false },
  { to: '/customer/profile', label: 'Profile', icon: '👤', end: false },
];

function Shell() {
  const notifications = useStore((s) => s.notifications);
  const hasUnread = notifications.some((n) => n.audience === 'customer' && !n.read);

  return (
    <div className="flex min-h-dvh bg-ht-bg">
      {/* Desktop/tablet sidebar */}
      <aside className="hidden sm:flex sm:w-56 sm:shrink-0 sm:flex-col sm:border-r sm:border-ht-border sm:bg-white sm:py-6">
        <div className="px-5 pb-6 text-[19px] font-semibold text-ht-navy">Hello Tailor</div>
        <nav className="flex flex-col gap-1 px-3">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-ht-input px-3 py-2.5 text-[14px] font-medium transition-colors',
                  isActive ? 'bg-ht-info-bg text-ht-ocean' : 'text-ht-text-secondary hover:bg-ht-bg',
                )
              }
            >
              <span className="relative text-[18px]">
                {t.icon}
                {t.label === 'Alerts' && hasUnread ? (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ht-error" />
                ) : null}
              </span>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 pb-20 sm:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ht-border bg-white sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium min-h-[56px]',
                  isActive ? 'text-ht-ocean' : 'text-ht-text-secondary',
                )
              }
            >
              <span className="relative text-[19px] leading-none">
                {t.icon}
                {t.label === 'Alerts' && hasUnread ? (
                  <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-ht-error" />
                ) : null}
              </span>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function CustomerApp() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="category" element={<CategoryBrowse />} />
        <Route path="tailors" element={<Tailors />} />
        <Route path="tailor/:id" element={<TailorProfile />} />
        <Route path="tailor/:id/reviews" element={<TailorReviews />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="notifications" element={<Notifications />} />

        <Route path="booking/:tailorId/category" element={<BookingCategory />} />
        <Route path="booking/:tailorId/person" element={<BookingPerson />} />
        <Route path="booking/:tailorId/cloth-details" element={<ClothDetails />} />
        <Route path="booking/:tailorId/design-upload" element={<DesignUpload />} />
        <Route path="booking/:tailorId/measurement" element={<MeasurementStep />} />
        <Route path="booking/:tailorId/measurement-history" element={<MeasurementHistory />} />
        <Route path="booking/:tailorId/date" element={<BookingDate />} />
        <Route path="booking/:tailorId/delivery" element={<DeliveryDate />} />
        <Route path="booking/:tailorId/method" element={<Method />} />
        <Route path="booking/:tailorId/notes" element={<Notes />} />
        <Route path="booking/:tailorId/summary" element={<Summary />} />
        <Route path="booking/:tailorId/payment" element={<BookingPayment />} />
        <Route path="booking/:tailorId/processing" element={<Processing />} />
        <Route path="booking/:tailorId/success" element={<BookingSuccess />} />

        <Route path="order/:id" element={<OrderTracking />} />
        <Route path="order/:id/balance-payment" element={<BalancePayment />} />
        <Route path="order/:id/invoice" element={<Invoice />} />
        <Route path="order/:id/reorder" element={<Reorder />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/addresses" element={<Addresses />} />
        <Route path="profile/addresses/add" element={<AddAddress />} />
        <Route path="profile/family" element={<Family />} />
        <Route path="profile/family/add" element={<AddFamilyMember />} />
        <Route path="profile/measurements" element={<Measurements />} />
        <Route path="profile/measurements/add" element={<AddMeasurement />} />
        <Route path="profile/wallet" element={<Wallet />} />
        <Route path="profile/loyalty" element={<Loyalty />} />
        <Route path="profile/membership" element={<Membership />} />
        <Route path="profile/referral" element={<Referral />} />
        <Route path="profile/offers" element={<Offers />} />
        <Route path="profile/complaints" element={<Complaints />} />
        <Route path="profile/complaints/new" element={<NewComplaint />} />
        <Route path="profile/complaints/:id" element={<ComplaintDetail />} />
        <Route path="profile/support" element={<Support />} />
        <Route path="profile/support/chat" element={<SupportChat />} />
        <Route path="profile/language" element={<LanguageScreen />} />

        <Route path="store/material" element={<MaterialStore />} />
        <Route path="store/material/cart" element={<Cart />} />
        <Route path="store/material/:id" element={<MaterialDetail />} />
        <Route path="store/readymade" element={<ReadymadeStore />} />
        <Route path="store/readymade/:id" element={<ReadymadeDetail />} />

        <Route path="ai-design" element={<AIDesign />} />

        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Route>
    </Routes>
  );
}
