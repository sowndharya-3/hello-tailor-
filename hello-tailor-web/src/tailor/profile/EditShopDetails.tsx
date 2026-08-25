// Ported from hello-tailor-app/app/(tailor)/profile/edit.tsx. Photo/cover picking reads a
// local file into a data: URL (no upload backend, matches PhotoGridPicker's approach).
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function EditShopDetails() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [name, setName] = useState(tailor.name);
  const [shopName, setShopName] = useState(tailor.shopName);
  const [about, setAbout] = useState(tailor.about);
  const [experienceYears, setExperienceYears] = useState(String(tailor.experienceYears));
  const [image, setImage] = useState(tailor.image);
  const [cover, setCover] = useState(tailor.cover);
  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onSave = () => {
    updateTailorProfile({ name, shopName, about, experienceYears: Number(experienceYears) || tailor.experienceYears, image, cover });
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Edit Shop Details" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <div className="relative mb-14 h-[130px] overflow-hidden rounded-ht-card bg-ht-disabled-bg">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => coverInput.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[rgba(23,59,87,0.35)] text-white"
          >
            <span>📷</span>
            <span className="text-[12px] font-medium">Change Cover</span>
          </button>
          <input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) setCover(await readFile(f)); }} />

          <button onClick={() => avatarInput.current?.click()} className="absolute -bottom-9 left-5">
            <img src={image} alt="" className="h-[76px] w-[76px] rounded-full border-[3px] border-white object-cover" />
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-ht-ocean text-[11px] text-white">📷</span>
          </button>
          <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) setImage(await readFile(f)); }} />
        </div>

        <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <Input label="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Business name" />
        <Input label="Experience (years)" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} inputMode="numeric" />
        <div className="mb-3">
          <label className="mb-1.5 block text-[13px] font-medium text-ht-text">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell customers about your work"
            rows={4}
            className="w-full rounded-ht-input border-[1.5px] border-ht-border bg-white p-3.5 text-[15px] text-ht-text outline-none focus:border-ht-ocean"
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
