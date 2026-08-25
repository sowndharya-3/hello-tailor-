// Ported from hello-tailor-app/app/(tailor)/profile/photos.tsx — persists into Tailor.gallery.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { PhotoGridPicker } from '../components/PhotoGridPicker';
import { useMyTailor, useStore } from '@/store/useStore';

export default function Photos() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [photos, setPhotos] = useState<string[]>(tailor.gallery);
  const navigate = useNavigate();

  const onSave = () => {
    updateTailorProfile({ gallery: photos });
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Shop & Portfolio Photos" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <PhotoGridPicker photos={photos} onChange={setPhotos} max={9} />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
