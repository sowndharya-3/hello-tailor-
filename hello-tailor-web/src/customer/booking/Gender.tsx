import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';

const GENDERS = [{ id: 'Men', icon: '👔' }, { id: 'Women', icon: '👗' }, { id: 'Kids', icon: '🧒' }] as const;

export default function BookingGender() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const resetBooking = useStore((s) => s.resetBooking);
  const updateBooking = useStore((s) => s.updateBooking);
  useEffect(() => { resetBooking(); updateBooking({ tailorId }); }, [resetBooking, tailorId, updateBooking]);
  return <div><ScreenHeader title="Select Gender" subtitle="Who is this garment for?" />
    <div className="px-4 pt-4 sm:px-6"><StepProgress step={1} total={10} label="Gender" /></div>
    <div className="grid grid-cols-3 gap-3 p-4 sm:px-6">{GENDERS.map((gender) => <button key={gender.id} onClick={() => { updateBooking({ gender: gender.id }); navigate(`/customer/booking/${tailorId}/category`); }} className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-ht-card border border-ht-border bg-ht-card text-ht-text hover:border-ht-ocean"><span className="text-3xl">{gender.icon}</span><span className="font-semibold">{gender.id}</span></button>)}</div>
  </div>;
}
