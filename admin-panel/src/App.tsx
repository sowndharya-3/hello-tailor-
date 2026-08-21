import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
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

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
