import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from '@/auth/Splash';
import Onboarding from '@/auth/Onboarding';
import Login from '@/auth/Login';
import Otp from '@/auth/Otp';
import RoleSelect from '@/auth/RoleSelect';
import CustomerApp from '@/customer/CustomerApp';
import TailorApp from '@/tailor/TailorApp';
import AdminApp from '@/admin/AdminApp';
import { useStore } from '@/store/useStore';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const loggedIn = useStore((s) => s.loggedIn);
  if (!loggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // BASE_URL comes from vite.config's `base` option — keeps deep links and
  // refreshes working correctly when this is deployed under a subfolder/subdomain.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/role-select"
          element={
            <RequireAuth>
              <RoleSelect />
            </RequireAuth>
          }
        />
        <Route
          path="/customer/*"
          element={
            <RequireAuth>
              <CustomerApp />
            </RequireAuth>
          }
        />
        <Route
          path="/tailor/*"
          element={
            <RequireAuth>
              <TailorApp />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminApp />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
