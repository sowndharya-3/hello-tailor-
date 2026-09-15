// Section 3 — first screen on app open. Decides where to go next (once, on mount — no repeated
// navigation/state updates, per the brief's "must not repeatedly trigger navigation" rule) and
// shows a short, professional logo animation while that decision plays out.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { isOnboardingComplete } from '@/lib/onboarding';
import logo from '@/assets/hello-tailor-logo.png';

const SPLASH_DURATION_MS = 1100;

export default function Splash() {
  const navigate = useNavigate();
  const loggedIn = useStore((s) => s.loggedIn);
  const role = useStore((s) => s.role);

  useEffect(() => {
    const t = setTimeout(() => {
      if (loggedIn && role) {
        navigate(`/${role}`, { replace: true });
      } else if (loggedIn) {
        navigate('/role-select', { replace: true });
      } else if (isOnboardingComplete()) {
        navigate('/login', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
    // Deliberately empty deps — this must run exactly once on mount. loggedIn/role are read at
    // that moment; re-running on their change would be a redirect loop waiting to happen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="splash-bg flex min-h-dvh flex-col items-center justify-center bg-ht-bg px-6">
      <img src={logo} alt="Hello Tailor" className="splash-logo h-[150px] w-[150px] object-contain" />
      <p className="splash-tagline mt-5 text-[15px] font-medium text-ht-text-secondary">
        Perfect Fit. Trusted Tailors.
      </p>
    </div>
  );
}
