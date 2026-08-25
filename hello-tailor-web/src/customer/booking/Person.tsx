import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Avatar from '@/components/ui/Avatar';

export default function BookingPerson() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const family = useStore((s) => s.family);

  const choose = (personId: string) => {
    updateBooking({ personId });
    navigate(`/customer/booking/${tailorId}/cloth-details`);
  };

  return (
    <div>
      <ScreenHeader title="Whose Measurement?" subtitle={`${booking.category ?? ''} • Select a person`} />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={2} total={11} label="Person" /></div>
      <div className="flex flex-col gap-2.5 p-4 sm:px-6">
        <button onClick={() => choose('self')} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4 text-left">
          <Avatar src={ME_CUSTOMER.avatar} size={48} />
          <div className="flex-1">
            <p className="text-[14px] font-medium text-ht-text">Myself</p>
            <p className="text-[12px] text-ht-text-secondary">{ME_CUSTOMER.name}</p>
          </div>
          <span className="text-ht-disabled-text">›</span>
        </button>
        {family.map((f) => (
          <button key={f.id} onClick={() => choose(f.id)} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4 text-left">
            <Avatar src={f.avatar} size={48} />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-ht-text">{f.name}</p>
              <p className="text-[12px] text-ht-text-secondary">{f.relationship}</p>
            </div>
            <span className="text-ht-disabled-text">›</span>
          </button>
        ))}
        <button onClick={() => navigate('/customer/profile/family/add')} className="flex items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-ht-ocean">
          + Add New Family Member
        </button>
      </div>
    </div>
  );
}
