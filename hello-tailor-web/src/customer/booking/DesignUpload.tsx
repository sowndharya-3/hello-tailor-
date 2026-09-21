import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StepProgress from '@/customer/components/StepProgress';
import Button from '@/components/ui/Button';

export default function DesignUpload() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const updateBooking = useStore((s) => s.updateBooking);
  const commitDraftItem = useStore((s) => s.commitDraftItem);
  const [photos, setPhotos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls].slice(0, 6));
  };
  const remove = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const submit = () => {
    // This was the last per-garment step: save the garment into the booking, then let the
    // customer add another one or continue to scheduling.
    updateBooking({ designPhotos: photos });
    commitDraftItem();
    navigate(`/customer/booking/${tailorId}/items`);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="Design Reference" subtitle="Optional but recommended" />
      <div className="px-4 pt-4 sm:px-6"><StepProgress step={4} total={11} label="Design Upload" /></div>
      <div className="p-4 sm:px-6">
        <p className="mb-4 text-[13px] text-ht-text-secondary">Upload up to 6 reference photos (JPG/PNG, max 5MB each) to help the tailor understand your design.</p>
        <div className="flex flex-wrap gap-2.5">
          {photos.map((uri) => (
            <div key={uri} className="relative h-24 w-24">
              <img src={uri} alt="" className="h-24 w-24 rounded-ht-input object-cover" />
              <button onClick={() => remove(uri)} className="absolute -right-1.5 -top-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-ht-error text-white" style={{ width: 22, height: 22 }}>×</button>
            </div>
          ))}
          {photos.length < 6 ? (
            <button onClick={() => inputRef.current?.click()} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-ht-input border-[1.5px] border-dashed border-ht-border">
              <span className="text-lg">🖼️</span>
              <span className="text-[12px] text-ht-ocean">Gallery</span>
            </button>
          ) : null}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        <button onClick={() => inputRef.current?.click()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-ht-button border-[1.5px] border-ht-ocean py-3.5 text-[15px] font-semibold text-ht-ocean">
          📷 Take a Photo
        </button>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <Button label={photos.length ? 'Add Garment to Booking' : 'Skip Photos & Add Garment'} onClick={submit} />
      </div>
    </div>
  );
}
