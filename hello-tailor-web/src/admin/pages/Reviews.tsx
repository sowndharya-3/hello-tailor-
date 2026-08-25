import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { Review } from '@/store/types';

export default function Reviews() {
  const { show } = useToast();
  const reviews = useStore((s) => s.reviews);
  const tailors = useStore((s) => s.tailors);
  const toggleReviewStatus = useStore((s) => s.toggleReviewStatus);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [target, setTarget] = useState<Review | null>(null);

  const tailorName = (tailorId: string) => tailors.find((t) => t.id === tailorId)?.shopName ?? tailorId;

  const filtered = useMemo(() => reviews.filter((r) =>
    (!search || r.customerName.toLowerCase().includes(search.toLowerCase()) || tailorName(r.tailorId).toLowerCase().includes(search.toLowerCase())) &&
    (!rating || r.rating === Number(rating))
  ), [reviews, search, rating, tailors]);

  const columns: Column<Review>[] = [
    { key: 'customerName', header: 'Customer' },
    { key: 'tailorId', header: 'Tailor', render: (r) => tailorName(r.tailorId) },
    { key: 'orderId', header: 'Order', render: (r) => r.orderId ?? '—' },
    { key: 'rating', header: 'Rating', sortValue: (r) => r.rating, render: (r) => <span className="flex items-center gap-1 font-medium"><Star size={13} className="fill-ht-gold text-ht-gold" /> {r.rating}</span> },
    { key: 'text', header: 'Comment', render: (r) => <span className="line-clamp-2 max-w-xs text-sm">{r.text}</span> },
    { key: 'date', header: 'Date', sortValue: (r) => r.date },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const actions: RowAction<Review>[] = [
    { label: 'Hide / Unhide', onClick: (r) => setTarget(r) },
  ];

  return (
    <div>
      <PageHeader title="Review Management" description="Moderate customer reviews across the platform" />
      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64"><Input placeholder="Search customer / tailor" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="w-40"><Select placeholder="All Ratings" value={rating} onChange={(e) => setRating(e.target.value)} options={[5, 4, 3, 2, 1].map((r) => ({ label: `${r} Star`, value: String(r) }))} /></div>
          {(search || rating) && <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setRating(''); }}>Clear filters</Button>}
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} actions={actions} emptyTitle="No Reviews Found" />
      </Card>

      <ConfirmDialog
        open={!!target}
        title={target?.status === 'Hidden' ? 'Unhide Review' : 'Hide Review'}
        message={`Are you sure you want to ${target?.status === 'Hidden' ? 'make this review visible again' : 'hide this review from public view'}?`}
        confirmLabel={target?.status === 'Hidden' ? 'Unhide' : 'Hide'}
        destructive={target?.status !== 'Hidden'}
        onConfirm={() => { if (target) { toggleReviewStatus(target.id); show('success', 'Review updated.'); } setTarget(null); }}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
