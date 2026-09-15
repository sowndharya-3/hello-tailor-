import { useRef, useState } from 'react';
import { Camera, ImagePlus } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { PhotoType } from '@/store/chatTypes';
import ChatDialog from './ChatDialog';
import { readImageFile, type ChatRole } from './helpers';

export default function AttachmentDialog({ role, hasBooking, initialType, onClose, onSend }: {
  role: ChatRole; hasBooking: boolean; initialType?: PhotoType; onClose: () => void;
  onSend: (image: string, photoType: PhotoType, caption: string) => Promise<void>;
}) {
  const [photoType, setPhotoType] = useState<PhotoType>(initialType ?? (role === 'customer' ? 'Reference Design' : 'Progress Photo'));
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const options: PhotoType[] = role === 'customer' ? ['Reference Design', 'Cloth Photo', 'Measurement Reference', 'Other'] : ['Progress Photo', ...(hasBooking ? ['Final Design' as const] : []), 'Reference Design', 'Other'];
  async function selectImage(file?: File) {
    if (!file) return;
    setError('');
    setBusy(true);
    try { setImage(await readImageFile(file)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to open this photo.'); }
    finally { setBusy(false); }
  }
  return <ChatDialog title={photoType === 'Final Design' ? 'Share a design for approval' : 'Attach a photo'} onClose={() => { if (!busy) onClose(); }}>
    <form onSubmit={async (event) => {
      event.preventDefault();
      if (!image || busy) return;
      setBusy(true); setError('');
      try { await onSend(image, photoType, caption.trim()); onClose(); }
      catch { setError('Photo could not be sent. Your preview is saved here; please try again.'); }
      finally { setBusy(false); }
    }} className="space-y-4">
      <label className="block text-sm font-medium">Photo type<select value={photoType} onChange={(e) => setPhotoType(e.target.value as PhotoType)} disabled={busy}
        className="mt-1 block w-full rounded-ht-input border border-ht-border bg-white p-3">{options.map((item) => <option key={item}>{item}</option>)}</select></label>
      {image ? <img src={image} alt="Attachment preview" className="max-h-64 w-full rounded-ht-input bg-ht-bg object-contain" /> : <div className="rounded-ht-input border border-dashed border-ht-border bg-ht-bg p-8 text-center text-sm text-ht-text-secondary">Choose a photo to preview it before sending.</div>}
      <div className="flex gap-2">
        <Button type="button" variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()} icon={<ImagePlus size={18} />} label={image ? 'Replace photo' : 'Choose photo'} />
        <Button type="button" variant="secondary" disabled={busy} onClick={() => cameraRef.current?.click()} icon={<Camera size={18} />} label="Camera" />
      </div>
      <input ref={fileRef} aria-label="Choose attachment photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => { void selectImage(e.target.files?.[0]); e.target.value = ''; }} />
      <input ref={cameraRef} aria-label="Take attachment photo" type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { void selectImage(e.target.files?.[0]); e.target.value = ''; }} />
      <p className="text-xs text-ht-text-secondary">JPG, PNG, WebP or GIF, up to 10 MB. Camera availability depends on your browser and device.</p>
      <label className="block text-sm font-medium">{photoType === 'Final Design' ? 'Note to customer' : 'Caption (optional)'}
        <textarea maxLength={2000} value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="mt-1 block w-full resize-y rounded-ht-input border border-ht-border p-3 font-normal" placeholder="Describe the details to check…" />
      </label>
      {error && <p role="alert" className="text-sm text-ht-error">{error}</p>}
      <Button type="submit" disabled={!image || busy} label={busy ? 'Please wait…' : photoType === 'Final Design' ? 'Send for approval' : 'Send photo'} />
    </form>
  </ChatDialog>;
}
