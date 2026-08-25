import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Tailors from './pages/Tailors';
import TailorDetail from './pages/TailorDetail';
import HomeTailors from './pages/HomeTailors';
import ShopTailors from './pages/ShopTailors';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Payments from './pages/Payments';
import Commission from './pages/Commission';
import Membership from './pages/Membership';
import MembershipPlans from './pages/MembershipPlans';
import Offers from './pages/Offers';
import Advertisements from './pages/Advertisements';
import Reviews from './pages/Reviews';
import Complaints from './pages/Complaints';
import Notifications from './pages/Notifications';
import Locations from './pages/Locations';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import SalesReport from './pages/SalesReport';
import TailorIncomeReport from './pages/TailorIncomeReport';
import AppIncomeReport from './pages/AppIncomeReport';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Responsive shell: a permanent left rail at md:+ viewports, collapsing to a hamburger-
// triggered slide-in drawer below that — pure CSS for the desktop rail, a small bit of
// state for the mobile drawer's open/closed toggle.
export default function AdminApp() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-ht-bg md:flex">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="fixed left-0 top-0 h-screen w-64">
            <Sidebar />
          </div>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/45" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] shadow-xl">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col min-w-0">
          <Topbar onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/tailors" element={<Tailors />} />
              <Route path="/tailors/home" element={<HomeTailors />} />
              <Route path="/tailors/shop" element={<ShopTailors />} />
              <Route path="/tailors/:id" element={<TailorDetail />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/commission" element={<Commission />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/membership-plans" element={<MembershipPlans />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/sales" element={<SalesReport />} />
              <Route path="/reports/tailor-income" element={<TailorIncomeReport />} />
              <Route path="/reports/app-income" element={<AppIncomeReport />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
