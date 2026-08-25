// Ported from hello-tailor-app/app/(tailor)/profile/location.tsx.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { LocationEditor, type LocationValue } from '../components/LocationEditor';
import { useMyTailor, useStore } from '@/store/useStore';

export default function Location() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const navigate = useNavigate();
  const [value, setValue] = useState<LocationValue>({ address: tailor.locality, landmark: '', city: tailor.city, state: tailor.state, pincode: '' });

  const onSave = () => {
    updateTailorProfile({ locality: value.address, city: value.city, state: value.state });
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Shop Location" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <LocationEditor value={value} onChange={setValue} onSave={onSave} />
      </div>
    </div>
  );
}
