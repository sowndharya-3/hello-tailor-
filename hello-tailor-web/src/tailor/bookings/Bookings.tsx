// Ported from hello-tailor-app/app/(tailor)/(tabs)/bookings.tsx.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { useMyBookings } from '@/store/useStore';
import { formatDate, hoursLeft } from '../lib/status';

const TABS = [
  { label: 'Pending', value: 'Pending' as const },
  { label: 'Accepted', value: 'Accepted' as const },
  { label: 'Rejected', value: 'Rejected' as const },
];

export default function Bookings() {
  const bookings = useMyBookings();
  const [tab, setTab] = useState<'Pending' | 'Accepted' | 'Rejected'>('Pending');

  const filtered = useMemo(() => {
    if (tab === 'Pending') return bookings.filter((b) => b.status === 'Requested');
    if (tab === 'Accepted') return bookings.filter((b) => b.status !== 'Requested' && b.status !== 'Rejected' && b.status !== 'Cancelled');
    return bookings.filter((b) => b.status === 'Rejected');
  }, [bookings, tab]);

  return (
    <div>
      <ScreenHeader title="Bookings" back={false} />
      <div className="px-4 py-3 sm:px-6">
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </div>
      <div className="flex flex-col gap-3 px-4 pb-8 sm:px-6">
        {filtered.length === 0 ? (
          <EmptyState icon="📅" title="No Bookings" message={`You don't have any ${tab.toLowerCase()} bookings right now.`} />
        ) : (
          filtered.map((b) => (
            <Link key={b.id} to={`/tailor/booking/${b.id}`}>
              <Card>
                <div className="flex items-center gap-3">
                  <img src={b.customerAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ht-text">{b.customerName}</p>
                    <p className="text-[12px] text-ht-text-secondary">{b.category}</p>
                  </div>
                  <p className="shrink-0 font-bold text-ht-text">₹{b.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ht-text-secondary">
                  <span>📅 Booked {formatDate(b.bookingDate)}</span>
                  <span>📦 Deliver {formatDate(b.deliveryDate)}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-ht-text-secondary">
                  <span className="min-w-0 truncate">📍 {b.location}</span>
                  <Badge label={b.pickupType} tone="neutral" />
                </div>
                {tab === 'Pending' && (
                  <div className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[11px] font-semibold text-ht-warning">
                    ⏰ {hoursLeft(b.requestedAt)}
                  </div>
                )}
                {tab === 'Rejected' && b.rejectReason && (
                  <p className="mt-2 line-clamp-2 text-[12px] text-ht-error">Reason: {b.rejectReason}</p>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
