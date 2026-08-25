// Ported from hello-tailor-app/components/tailor/PhotoGridPicker.tsx. Web has no photo
// library API, so picking reads the chosen file into a data: URL via FileReader — same
// end result (a displayable image URL added to the array) with no upload backend needed.
import { useRef } from 'react';

export function PhotoGridPicker({ photos, onChange, max = 6 }: { photos: string[]; onChange: (p: string[]) => void; max?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = () => inputRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange([...photos, String(reader.result)]);
    reader.readAsDataURL(file);
  };

  const remove = (uri: string) => onChange(photos.filter((p) => p !== uri));

  return (
    <div className="flex flex-wrap gap-3">
      {photos.map((uri) => (
        <div key={uri} className="relative h-[100px] w-[100px] overflow-hidden rounded-ht-input">
          <img src={uri} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => remove(uri)}
            aria-label="Remove photo"
            className="absolute right-1.5 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/55 text-white"
          >
            ×
          </button>
        </div>
      ))}
      {photos.length < max && (
        <button
          onClick={pick}
          className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-ht-input border-[1.5px] border-dashed border-ht-ocean bg-ht-info-bg text-ht-ocean"
        >
          <span className="text-2xl">📷</span>
          <span className="mt-1 text-[11px] font-medium">Add Photo</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}
