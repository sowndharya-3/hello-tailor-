// Sections 4-7 — three onboarding screens as one route with internal step state (no separate
// URLs per screen — nothing in the brief needs onboarding steps to be deep-linkable/back-
// buttonable individually, and a single component keeps the page-indicator/Skip/Next logic in
// one place instead of three near-duplicate route files).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Scissors, Ruler, CalendarCheck, PackageCheck, MapPin, Image as ImageIcon, MessageCircle, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { markOnboardingComplete } from '@/lib/onboarding';
import logo from '@/assets/hello-tailor-logo.png';

const STEPS = [
  { icon: Search, label: 'Find Your Tailor' },
  { icon: Scissors, label: 'Choose Stitching Service' },
  { icon: Ruler, label: 'Share Measurements & Design' },
  { icon: CalendarCheck, label: 'Book Your Order' },
  { icon: CalendarCheck, label: 'Track Your Order' },
  { icon: PackageCheck, label: 'Get It Delivered / Collect' },
] as const;

const BENEFITS = [
  { icon: MapPin, label: 'Find nearby tailors' },
  { icon: Ruler, label: 'Save measurements' },
  { icon: ImageIcon, label: 'Share designs' },
  { icon: MessageCircle, label: 'Chat with your tailor' },
  { icon: PackageCheck, label: 'Track orders' },
  { icon: ShieldCheck, label: 'Secure payments' },
] as const;

function PageIndicator({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-ht-ocean' : 'w-1.5 bg-ht-border'}`} />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    markOnboardingComplete();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-ht-bg px-6 pb-8 pt-10">
      <div className="flex items-center justify-between">
        <img src={logo} alt="Hello Tailor" className="h-9 w-9 object-contain" />
        {step < 2 ? (
          <button onClick={finish} className="text-[13px] font-medium text-ht-text-secondary">
            Skip
          </button>
        ) : (
          <span className="h-5" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-ht-info-bg">
              <Scissors size={72} className="text-ht-ocean" strokeWidth={1.5} />
            </div>
            <h1 className="text-[26px] font-semibold leading-tight text-ht-text">Your Tailor, Just a Tap Away</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ht-text-secondary">
              Discover trusted tailors, book stitching services and manage your tailoring needs effortlessly.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-center text-[24px] font-semibold text-ht-text">How It Works</h1>
            <p className="mt-2 text-center text-[14px] text-ht-text-secondary">From search to delivery, in six simple steps.</p>
            <div className="mt-8 flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ht-info-bg text-ht-ocean">
                    <s.icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 rounded-ht-input border border-ht-border bg-white px-4 py-3">
                    <p className="text-[13px] font-semibold text-ht-text-secondary">Step {i + 1}</p>
                    <p className="text-[14.5px] font-medium text-ht-text">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h1 className="text-[24px] font-semibold leading-tight text-ht-text">Everything You Need, In One Place</h1>
            <div className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 rounded-ht-card border border-ht-border bg-white px-3 py-4">
                  <b.icon size={22} className="text-ht-gold" strokeWidth={1.75} />
                  <p className="text-[12.5px] font-medium text-ht-text">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        <PageIndicator step={step} />
        {step < 2 ? (
          <Button label="Next" onClick={() => setStep((s) => s + 1)} />
        ) : (
          <Button label="Get Started" onClick={finish} variant="gold" />
        )}
      </div>
    </div>
  );
}
