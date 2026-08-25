import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/auth/Login';
import Otp from '@/auth/Otp';
import RoleSelect from '@/auth/RoleSelect';
import CustomerApp from '@/customer/CustomerApp';
import TailorApp from '@/tailor/TailorApp';
import AdminApp from '@/admin/AdminApp';
import { useStore } from '@/store/useStore';

function RootRedirect() {
  const loggedIn = useStore((s) => s.loggedIn);
  const role = useStore((s) => s.role);
  if (!loggedIn) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/role-select" replace />;
  return <Navigate to={`/${role}`} replace />;
}

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
        <Route path="/" element={<RootRedirect />} />
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
