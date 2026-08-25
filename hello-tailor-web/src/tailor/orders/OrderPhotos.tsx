// Ported from hello-tailor-app/app/(tailor)/order/[id]/photos.tsx — full-screen design photo
// viewer. Native swipe/zoom becomes a simple prev/next carousel with dot indicators on web.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { clsx } from '@/components/ui/clsx';

export default function OrderPhotos() {
  const { id } = useParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  if (!order) return null;
  const photos = order.designPhotos;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <button onClick={() => navigate(-1)} aria-label="Close" className="text-2xl text-white">
          ×
        </button>
        <span className="text-[13px] font-medium text-white">{index + 1} / {photos.length}</span>
        <span className="w-6" />
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <img src={photos[index]} alt="" className="max-h-full max-w-full object-contain" />
      </div>

      <div className="flex justify-center gap-2 pb-8">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Photo ${i + 1}`}
            className={clsx('h-1.5 rounded-full bg-white/35 transition-all', i === index ? 'w-[18px] bg-white' : 'w-1.5')}
          />
        ))}
      </div>
    </div>
  );
}
