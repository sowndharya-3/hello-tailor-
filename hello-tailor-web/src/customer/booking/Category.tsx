import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { categories } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';

export default function BookingCategory() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const tailors = useStore((s) => s.tailors);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const updateBooking = useStore((s) => s.updateBooking);
  const resetBooking = useStore((s) => s.resetBooking);

  useEffect(() => {
    resetBooking();
    updateBooking({ tailorId: tailor.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ScreenHeader title="Select Category" subtitle={tailor.shopName} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={1} total={11} label="Category" /></div>
      <div className="flex items-center gap-2.5 px-4 pb-2 sm:px-6">
        <img src={tailor.image} alt="" className="h-10 w-10 rounded-ht-input object-cover" />
        <div>
          <p className="text-[14px] font-semibold text-ht-text">{tailor.shopName}</p>
          <p className="text-[12px] text-ht-text-secondary">Who's stitching: {tailor.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3.5 p-4 sm:grid-cols-4 sm:px-6 lg:grid-cols-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => { updateBooking({ category: c.name }); navigate(`/customer/booking/${tailor.id}/person`); }}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-ht-card border border-ht-border bg-ht-card"
          >
            <span className="text-2xl">🧵</span>
            <span className="text-[13px] font-medium text-ht-text">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
