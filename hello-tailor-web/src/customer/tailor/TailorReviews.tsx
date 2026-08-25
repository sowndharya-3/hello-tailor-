import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

export default function TailorReviews() {
  const { id } = useParams<{ id: string }>();
  const tailors = useStore((s) => s.tailors);
  const seedReviews = useStore((s) => s.reviews);
  const tailor = tailors.find((t) => t.id === id) ?? tailors[0];
  const [reviews, setReviews] = useState(seedReviews.filter((r) => r.tailorId === tailor.id && r.status === 'Visible'));
  const [writeOpen, setWriteOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => Math.round(r.rating) === star).length }));
  const total = reviews.length || 1;

  const submitReview = () => {
    setReviews((prev) => [
      { id: `local-${Date.now()}`, tailorId: tailor.id, customerName: ME_CUSTOMER.name, avatar: ME_CUSTOMER.avatar, rating: newRating, date: 'Just now', text: newText || 'Great experience!', verified: true, status: 'Visible' as const },
      ...prev,
    ]);
    setWriteOpen(false);
    setNewText('');
  };

  return (
    <div>
      <ScreenHeader title="Ratings & Reviews" subtitle={tailor.shopName} />
      <div className="p-4 sm:px-6">
        <div className="flex gap-6 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <div className="flex w-24 flex-col items-center">
            <p className="text-[28px] font-bold text-ht-text">{tailor.rating.toFixed(1)}</p>
            <StarRating rating={tailor.rating} />
            <p className="mt-1 text-[12px] text-ht-text-secondary">{tailor.reviewCount} reviews</p>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 justify-center">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-1.5">
                <span className="w-2.5 text-[12px] text-ht-text-secondary">{b.star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ht-disabled-bg">
                  <div className="h-full bg-ht-gold" style={{ width: `${(b.count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button label="Write a Review" variant="secondary" className="mt-4" onClick={() => setWriteOpen(true)} />

        <div className="mt-4 flex flex-col gap-2.5">
          {reviews.length ? reviews.map((item) => (
            <div key={item.id} className="rounded-ht-card border border-ht-border bg-ht-card p-4">
              <div className="flex gap-2.5">
                <img src={item.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-medium text-ht-text">{item.customerName}</span>
                    {item.verified ? <Badge label="Verified Order" tone="success" /> : null}
                  </div>
                  <StarRating rating={item.rating} size={12} />
                </div>
                <span className="text-[12px] text-ht-disabled-text">{item.date}</span>
              </div>
              <p className="mt-2 text-[14px] text-ht-text-secondary">{item.text}</p>
            </div>
          )) : (
            <EmptyState icon="💬" title="No Reviews Yet" message="Be the first to review this tailor after your order." />
          )}
        </div>
      </div>

      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title="Write a Review">
        <p className="mb-2 text-[14px] font-medium text-ht-text">Your Rating</p>
        <div className="mb-4 flex gap-1 text-3xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setNewRating(n)} className={n <= newRating ? 'text-ht-gold' : 'text-ht-border'}>★</button>
          ))}
        </div>
        <p className="mb-2 text-[14px] font-medium text-ht-text">Your Review</p>
        <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Share your experience..." className="min-h-[100px] w-full rounded-ht-input border-[1.5px] border-ht-border p-3 text-[14px] text-ht-text outline-none" />
        <Button label="Submit Review" className="mt-4" onClick={submitReview} />
      </Modal>
    </div>
  );
}
