import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerBookings } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const CATEGORIES = ['Stitching Quality', 'Delivery Delay', 'Wrong Measurement', 'Damaged Item', 'Payment Issue', 'Other'];

export default function NewComplaint() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const bookings = useCustomerBookings();
  const [orderId, setOrderId] = useState(params.get('orderId') ?? bookings[0]?.id ?? '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="text-6xl">✅</span>
        <p className="mt-3 text-[17px] font-semibold text-ht-text">Ticket Raised</p>
        <p className="mt-1.5 text-[14px] text-ht-text-secondary">Our support team will get back to you within 48 hours.</p>
        <div className="mt-5 w-full max-w-sm"><Button label="View My Complaints" onClick={() => navigate('/customer/profile/complaints', { replace: true })} /></div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Raise a Ticket" />
      <div className="p-4 sm:px-6">
        <p className="mb-2 text-[14px] font-medium text-ht-text">Order</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {bookings.map((o) => (
            <button key={o.id} onClick={() => setOrderId(o.id)} className={clsx('rounded-full border px-3 py-2.5 text-[13px] font-medium', orderId === o.id ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{o.id}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Category</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={clsx('rounded-full border px-3 py-2.5 text-[13px] font-medium', category === c ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Description</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." className="mb-4 min-h-[110px] w-full rounded-ht-input border-[1.5px] border-ht-border p-3 text-[14px] text-ht-text outline-none" />

        <p className="mb-2 text-[14px] font-medium text-ht-text">Attach Photo <span className="font-normal text-ht-text-secondary">(optional)</span></p>
        {image ? (
          <img src={image} alt="" className="h-25 w-25 rounded-ht-input object-cover" style={{ width: 100, height: 100 }} />
        ) : (
          <button onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-ht-button border-[1.5px] border-dashed border-ht-border py-3.5 text-[14px] font-medium text-ht-ocean">
            📷 Add Photo
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImage(URL.createObjectURL(f)); }} />

        <Button label="Submit Ticket" disabled={!description.trim()} onClick={() => setSubmitted(true)} className="mt-5" />
      </div>
    </div>
  );
}
