import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';

export default function Notes() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const updateBooking = useStore((s) => s.updateBooking);
  const [notes, setNotes] = useState('');

  return (
    <div className="pb-24">
      <ScreenHeader title="Additional Notes" subtitle="Anything else the tailor should know?" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={9} total={11} label="Notes" /></div>
      <div className="p-4 sm:px-6">
        <p className="mb-2 text-[14px] font-medium text-ht-text">Notes <span className="font-normal text-ht-text-secondary">(optional)</span></p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g. Please keep the fit slightly loose around the waist..."
          className="min-h-[140px] w-full rounded-ht-input border-[1.5px] border-ht-border p-3.5 text-[14px] text-ht-text outline-none"
        />
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label="Continue to Summary" onClick={() => { updateBooking({ notes }); navigate(`/customer/booking/${tailorId}/summary`); }} />
      </div>
    </div>
  );
}
