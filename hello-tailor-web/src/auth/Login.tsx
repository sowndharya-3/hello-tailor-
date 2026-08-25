import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import logo from '@/assets/hello-tailor-logo.png';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const setAuthPhone = useStore((s) => s.setAuthPhone);
  const navigate = useNavigate();
  const error = mobile.length > 0 && mobile.length !== 10 ? 'Enter a valid 10-digit mobile number' : undefined;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-ht-bg px-5 pb-8">
      <div className="mt-12 mb-8 flex justify-center">
        <img src={logo} alt="Hello Tailor" className="h-[150px] w-[150px] object-contain" />
      </div>
      <h1 className="text-2xl font-semibold text-ht-text">Welcome to Hello Tailor</h1>
      <p className="mt-1 text-[15px] text-ht-text-secondary">Enter your mobile number to continue</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (mobile.length !== 10) return;
          setAuthPhone(mobile);
          navigate(`/otp?mobile=${mobile}`);
        }}
      >
        <label className="mb-1.5 block text-[13px] font-medium text-ht-text">
          Mobile Number <span className="text-ht-error">*</span>
        </label>
        <div className="flex gap-2.5">
          <div className="flex min-h-[50px] items-center rounded-ht-input border-[1.5px] border-ht-border bg-white px-3.5 text-[15px]">
            +91
          </div>
          <div className="flex-1">
            <Input
              placeholder="98765 43210"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={error}
            />
          </div>
        </div>

        <Button label="Send OTP" type="submit" disabled={mobile.length !== 10} className="mt-2" />

        <p className="mt-4 text-center text-[13px] text-ht-text-secondary">
          By continuing, you agree to Hello Tailor's Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
}
