import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import logo from '../assets/hello-tailor-logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const ok = login(email, password);
    if (ok) {
      navigate('/');
    } else {
      setError('Invalid credentials. Password must be at least 4 characters.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={logo} alt="Hello Tailor" className="h-16 object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-navy">Admin Console</h1>
            <p className="text-sm text-text-secondary">Sign in to manage the Hello Tailor marketplace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email or Username"
            placeholder="admin@hellotailor.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email ? 'Email is required' : undefined}
          />
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 text-right">
              <button type="button" className="text-sm font-medium text-ocean hover:underline">Forgot Password?</button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-[#FEF3F2] px-3.5 py-2.5 text-sm font-medium text-error">{error}</div>
          )}

          <Button type="submit" variant="primary" className="mt-2 w-full justify-center" icon={<Lock size={16} />}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-text-secondary">
          <Mail size={13} /> Need access? Contact your system administrator.
        </div>
      </div>
    </div>
  );
}
