import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function TailorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tailors = useStore((s) => s.tailors);
  const reviews = useStore((s) => s.reviews);
  const tailor = tailors.find((t) => t.id === id) ?? tailors[0];
  const tailorReviews = reviews.filter((r) => r.tailorId === tailor.id && r.status === 'Visible');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <div className="pb-28">
      <div className="relative">
        <img src={tailor.cover} alt="" className="h-48 w-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow">‹</button>
        <img src={tailor.image} alt={tailor.shopName} className="absolute -bottom-8 left-4 h-20 w-20 rounded-2xl border-4 border-white object-cover sm:left-6" />
      </div>

      <div className="px-4 pt-11 sm:px-6">
        <div className="flex items-center gap-1.5">
          <h1 className="text-[21px] font-semibold text-ht-text">{tailor.shopName}</h1>
          {tailor.verified ? <span className="text-ht-ocean">✔️</span> : null}
        </div>
        <p className="mt-0.5 text-[14px] text-ht-text-secondary">{tailor.name} • {tailor.experienceYears} yrs experience</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[13px] text-ht-text-secondary"><StarRating rating={tailor.rating} /> ({tailor.reviewCount})</span>
          <Badge label={tailor.isOpen ? 'Open Now' : 'Closed'} tone={tailor.isOpen ? 'success' : 'error'} />
          {tailor.featured ? <Badge label="Featured" tone="gold" /> : null}
          <Badge label={tailor.type} tone="navy" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[14px] text-ht-text">📍 {tailor.distanceKm} km • {tailor.locality}, {tailor.city}</div>
          <div className="flex items-center gap-2 text-[14px] text-ht-text">🕐 {tailor.workingHours}</div>
          <div className="flex items-center gap-2 text-[14px] text-ht-text">📦 Delivery in {tailor.deliveryDays} days</div>
        </div>

        <h2 className="mt-6 mb-2.5 text-[16px] font-semibold text-ht-text">About</h2>
        <p className="text-[14px] leading-relaxed text-ht-text-secondary">{tailor.about}</p>

        <div className="mt-4 flex h-28 items-center justify-center gap-1.5 rounded-ht-card bg-ht-info-bg text-ht-ocean">
          🗺️ <span className="text-[13px]">{tailor.locality}, {tailor.city} — Map preview</span>
        </div>

        <h2 className="mt-6 mb-2.5 text-[16px] font-semibold text-ht-text">Stitching Categories & Prices</h2>
        {tailor.services.map((s) => (
          <div key={s.id} className="flex items-center justify-between border-b border-ht-border py-2.5">
            <span className="text-[14px] text-ht-text">{s.name}</span>
            <span className="text-[14px] font-semibold text-ht-navy">₹{s.price} <span className="text-[12px] font-normal text-ht-text-secondary">{s.unit}</span></span>
          </div>
        ))}

        <h2 className="mt-6 mb-2.5 text-[16px] font-semibold text-ht-text">Photo Gallery</h2>
        <div className="flex gap-2 overflow-x-auto">
          {tailor.gallery.map((g, i) => (
            <button key={i} onClick={() => setViewerIndex(i)}>
              <img src={g} alt="" className="h-24 w-24 shrink-0 rounded-ht-input object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-ht-text">Reviews ({tailorReviews.length})</h2>
          <Link to={`/customer/tailor/${tailor.id}/reviews`} className="text-[13px] font-semibold text-ht-ocean">See All ›</Link>
        </div>
        {tailorReviews.slice(0, 2).map((r) => (
          <div key={r.id} className="mt-2.5 rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex gap-2.5">
              <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-ht-text">{r.customerName}</p>
                <StarRating rating={r.rating} size={12} />
              </div>
              <span className="text-[12px] text-ht-disabled-text">{r.date}</span>
            </div>
            <p className="mt-2 text-[14px] text-ht-text-secondary">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-ht-border bg-ht-card px-4 py-3.5 sm:left-56 sm:px-6">
        <div>
          <p className="text-[12px] text-ht-text-secondary">Starting at</p>
          <p className="text-[22px] font-semibold text-ht-navy">₹{tailor.startingPrice}</p>
        </div>
        <Link to={`/customer/booking/${tailor.id}/category`} className="ml-4 flex-1">
          <Button label="Book Now" />
        </Link>
      </div>

      {viewerIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setViewerIndex(null)}>
          <button className="absolute right-5 top-5 text-3xl text-white" onClick={() => setViewerIndex(null)}>×</button>
          <img src={tailor.gallery[viewerIndex]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain" />
        </div>
      ) : null}
    </div>
  );
}
