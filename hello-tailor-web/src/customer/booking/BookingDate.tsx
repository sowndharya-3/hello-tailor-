import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({ date: d, key: d.toISOString().slice(0, 10), unavailable: d.getDay() === 0 || i % 9 === 0 });
  }
  return days;
}

export default function BookingDate() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const updateBooking = useStore((s) => s.updateBooking);
  const days = buildDays();
  const [selected, setSelected] = useState<string | null>(null);

  const submit = () => {
    const d = days.find((x) => x.key === selected)!;
    updateBooking({ bookingDate: d.date.toDateString() });
    navigate(`/customer/booking/${tailorId}/delivery`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Booking Date" subtitle="When should the tailor start?" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={6} total={11} label="Booking Date" /></div>
      <div className="flex gap-4 px-4 pb-2 text-[12px] text-ht-text-secondary sm:px-6">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-ht-border bg-ht-card" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ht-disabled-bg" /> Unavailable</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ht-ocean" /> Selected</span>
      </div>
      <div className="grid grid-cols-4 gap-2.5 p-4 sm:grid-cols-7 sm:px-6">
        {days.map((item) => {
          const isSelected = selected === item.key;
          return (
            <button
              key={item.key}
              disabled={item.unavailable}
              onClick={() => setSelected(item.key)}
              className={clsx(
                'flex aspect-square flex-col items-center justify-center gap-0.5 rounded-ht-input border',
                item.unavailable ? 'cursor-not-allowed border-ht-disabled-bg bg-ht-disabled-bg' : isSelected ? 'border-ht-ocean bg-ht-ocean' : 'border-ht-border bg-ht-card',
              )}
            >
              <span className={clsx('text-[10px]', item.unavailable ? 'text-ht-disabled-text' : isSelected ? 'text-white' : 'text-ht-text-secondary')}>{DAY_NAMES[item.date.getDay()]}</span>
              <span className={clsx('text-[14px] font-semibold', item.unavailable ? 'text-ht-disabled-text' : isSelected ? 'text-white' : 'text-ht-text')}>{item.date.getDate()}</span>
            </button>
          );
        })}
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue" onClick={submit} disabled={!selected} />
      </div>
    </div>
  );
}
