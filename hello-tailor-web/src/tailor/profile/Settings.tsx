// Ported from hello-tailor-app/app/(tailor)/profile/settings.tsx. Only `deliveryDays` exists on
// the shared Tailor type — min order value maps to startingPrice; lead time / stitch duration
// have no store field, kept as local-only inputs (ponytail: UI-only, add store fields if a
// future screen needs to read them back).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';

export default function Settings() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [minOrderValue, setMinOrderValue] = useState(String(tailor.startingPrice));
  const [minLeadTime, setMinLeadTime] = useState('2 days');
  const [stitchDuration, setStitchDuration] = useState('3-4 days');
  const [deliveryDuration, setDeliveryDuration] = useState(String(tailor.deliveryDays));
  const navigate = useNavigate();

  const onSave = () => {
    updateTailorProfile({ startingPrice: Number(minOrderValue) || tailor.startingPrice, deliveryDays: Number(deliveryDuration) || tailor.deliveryDays });
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Order Settings" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <Input label="Minimum Order Value (₹)" inputMode="numeric" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} hint="Bookings below this amount won't be accepted" />
        <Input label="Minimum Lead Time" value={minLeadTime} onChange={(e) => setMinLeadTime(e.target.value)} hint="e.g. 2 days — earliest you can start a new order" />
        <Input label="Estimated Stitching Duration" value={stitchDuration} onChange={(e) => setStitchDuration(e.target.value)} hint="Typical time to complete stitching" />
        <Input label="Delivery Duration (days)" inputMode="numeric" value={deliveryDuration} onChange={(e) => setDeliveryDuration(e.target.value)} hint="Typical time to hand over / deliver after completion" />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
