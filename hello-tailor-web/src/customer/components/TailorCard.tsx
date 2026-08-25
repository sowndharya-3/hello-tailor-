import { Link } from 'react-router-dom';
import type { Tailor } from '@/store/types';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';

export default function TailorCard({ tailor, wide }: { tailor: Tailor; wide?: boolean }) {
  return (
    <div className={wide ? 'w-full overflow-hidden rounded-ht-card bg-ht-card shadow-[0_4px_12px_rgba(23,59,87,0.06)]' : 'w-60 shrink-0 overflow-hidden rounded-ht-card bg-ht-card shadow-[0_4px_12px_rgba(23,59,87,0.06)]'}>
      <div className="relative">
        <img src={tailor.image} alt={tailor.shopName} className="h-32 w-full object-cover" />
        {tailor.featured ? (
          <div className="absolute left-2 top-2">
            <Badge label="Featured" tone="gold" />
          </div>
        ) : null}
        <div className="absolute right-2 top-2">
          <Badge label={tailor.isOpen ? 'Open Now' : 'Closed'} tone={tailor.isOpen ? 'success' : 'error'} />
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-ht-text">{tailor.shopName}</p>
          <Badge label={tailor.type} tone="navy" />
        </div>
        <p className="truncate text-[13px] text-ht-text-secondary">{tailor.name} • {tailor.locality}</p>
        <div className="mt-1.5 flex items-center gap-2.5 text-[13px] text-ht-text-secondary">
          <span className="inline-flex items-center gap-1">
            <StarRating rating={tailor.rating} /> ({tailor.reviewCount})
          </span>
          <span>{tailor.distanceKm} km</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tailor.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full bg-ht-info-bg px-2.5 py-1 text-[11px] text-ht-ocean">{c}</span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[12px] text-ht-text-secondary">Starting at</p>
            <p className="text-[16px] font-semibold text-ht-navy">₹{tailor.startingPrice}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/customer/tailor/${tailor.id}`}>
              <Button label="Profile" variant="secondary" fullWidth={false} className="min-h-[38px] px-3 text-[13px]" />
            </Link>
            <Link to={`/customer/booking/${tailor.id}/category`}>
              <Button label="Book Now" fullWidth={false} className="min-h-[38px] px-3 text-[13px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
