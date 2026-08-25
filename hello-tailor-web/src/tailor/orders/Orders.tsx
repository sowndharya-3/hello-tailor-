// Ported from hello-tailor-app/app/(tailor)/(tabs)/orders.tsx.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { useMyBookings } from '@/store/useStore';
import { formatDate, statusTone } from '../lib/status';

const TABS = [
  { label: 'Daily', value: 'Daily' as const },
  { label: 'Completed', value: 'Completed' as const },
  { label: 'Cancelled', value: 'Cancelled' as const },
];

export default function Orders() {
  const bookings = useMyBookings();
  const [tab, setTab] = useState<'Daily' | 'Completed' | 'Cancelled'>('Daily');

  const filtered = useMemo(() => {
    if (tab === 'Daily') return bookings.filter((b) => !['Requested', 'Delivered', 'Rejected', 'Cancelled'].includes(b.status));
    if (tab === 'Completed') return bookings.filter((b) => b.status === 'Delivered');
    return bookings.filter((b) => b.status === 'Cancelled');
  }, [bookings, tab]);

  return (
    <div>
      <ScreenHeader title="Orders" back={false} />
      <div className="px-4 py-3 sm:px-6">
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </div>
      <div className="flex flex-col gap-3 px-4 pb-8 sm:px-6">
        {filtered.length === 0 ? (
          <EmptyState icon="🧾" title="No Orders" message={`No ${tab.toLowerCase()} orders to show.`} />
        ) : (
          filtered.map((b) => (
            <Link key={b.id} to={`/tailor/order/${b.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-ht-text-secondary">{b.id}</p>
                    <p className="mt-0.5 truncate font-semibold text-ht-text">{b.customerName} · {b.category}</p>
                  </div>
                  {tab === 'Daily' && <Badge label={b.status} tone={statusTone(b.status)} />}
                  {tab === 'Completed' && <Badge label="Delivered" tone="success" />}
                  {tab === 'Cancelled' && <Badge label="Cancelled" tone="error" />}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[12px] text-ht-text-secondary">📦 Delivery: {formatDate(b.deliveryDate)}</span>
                  <span className="font-bold text-ht-text">₹{b.amount.toLocaleString('en-IN')}</span>
                </div>
                {tab === 'Cancelled' && b.cancelReason && <p className="mt-2 line-clamp-2 text-[12px] text-ht-error">Reason: {b.cancelReason}</p>}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
