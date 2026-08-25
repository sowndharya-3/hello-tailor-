// Ported from hello-tailor-app/app/(tailor)/reviews.tsx.
import { useShallow } from 'zustand/react/shallow';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StarRating from '@/components/ui/StarRating';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { formatDate } from '../lib/status';

export default function Reviews() {
  const reviews = useStore(useShallow((s) => s.reviews.filter((r) => r.tailorId === s.myTailorId)));
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));

  return (
    <div>
      <ScreenHeader title="Customer Reviews" />
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4 sm:px-6">
        {total === 0 ? (
          <EmptyState icon="⭐" title="No Reviews" message="Once customers rate your work, reviews will appear here." />
        ) : (
          <>
            <Card className="flex gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <p className="text-[32px] font-bold text-ht-text">{avg.toFixed(1)}</p>
                <StarRating rating={avg} size={16} />
                <p className="mt-1 text-[12px] text-ht-text-secondary">{total} reviews</p>
              </div>
              <div className="flex-1">
                {dist.map((d) => (
                  <div key={d.star} className="mb-1.5 flex items-center gap-2">
                    <span className="w-2.5 text-[11px] text-ht-text-secondary">{d.star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ht-disabled-bg">
                      <div className="h-1.5 rounded-full bg-ht-gold" style={{ width: `${total ? (d.count / total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-4 text-right text-[11px] text-ht-text-secondary">{d.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {reviews.map((r) => (
              <Card key={r.id}>
                <div className="mb-2 flex items-center gap-3">
                  <img src={r.avatar} alt="" className="h-[38px] w-[38px] rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-ht-text">{r.customerName}</p>
                    <p className="text-[11px] text-ht-text-secondary">{formatDate(r.date)}</p>
                  </div>
                </div>
                <StarRating rating={r.rating} size={14} />
                <p className="mt-2 text-[13px] leading-relaxed text-ht-text">{r.text}</p>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
