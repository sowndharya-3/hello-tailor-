// Ported from hello-tailor-app/app/(tailor)/profile/hours.tsx.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { WorkingHoursEditor } from '../components/WorkingHoursEditor';
import { useStore } from '@/store/useStore';
import type { DayHours } from '@/store/useStore';

export default function Hours() {
  const myHours = useStore((s) => s.myHours);
  const setHours = useStore((s) => s.setHours);
  const [hours, setLocalHours] = useState<DayHours[]>(myHours);
  const navigate = useNavigate();

  const onSave = () => {
    setHours(hours);
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Working Hours" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <WorkingHoursEditor hours={hours} onChange={setLocalHours} />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
