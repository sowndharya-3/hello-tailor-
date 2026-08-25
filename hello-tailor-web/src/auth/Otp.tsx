import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

export default function Otp() {
  const [params] = useSearchParams();
  const mobile = params.get('mobile') ?? '';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(30);
  const login = useStore((s) => s.login);
  const navigate = useNavigate();
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const code = digits.join('');
  const complete = code.length === 6;

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  function verify() {
    if (code !== '123456') {
      setError('Invalid OTP. Try 123456 for this demo.');
      return;
    }
    setError('');
    login(mobile);
    navigate('/role-select');
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-ht-bg px-5 pt-16 pb-8">
      <h1 className="text-2xl font-semibold text-ht-text">Verify your number</h1>
      <p className="mt-1 text-[15px] text-ht-text-secondary">
        Enter the 6-digit code sent to +91 {mobile} · <span className="text-ht-ocean">use 123456</span>
      </p>

      <div className="mt-6 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus();
            }}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-12 rounded-ht-input border-[1.5px] border-ht-border text-center text-xl font-semibold outline-none focus:border-ht-ocean"
          />
        ))}
      </div>
      {error ? <p className="mt-3 text-[13px] text-ht-error">{error}</p> : null}

      <Button label="Verify & Continue" disabled={!complete} onClick={verify} className="mt-6" />

      <div className="mt-4 text-center text-[13px] text-ht-text-secondary">
        {seconds > 0 ? (
          `Resend OTP in 00:${String(seconds).padStart(2, '0')}`
        ) : (
          <button className="text-ht-ocean font-medium" onClick={() => setSeconds(30)}>
            Resend OTP
          </button>
        )}
      </div>
      <button className="mt-2 text-center text-[13px] font-medium text-ht-navy" onClick={() => navigate('/login')}>
        Change Number
      </button>
    </div>
  );
}
