import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerBookings, useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const TABS = ['All', 'Active', 'Completed', 'Cancelled'] as const;

function bucketFor(status: Booking['status']): 'Active' | 'Completed' | 'Cancelled' {
  if (status === 'Delivered') return 'Completed';
  if (status === 'Cancelled' || status === 'Rejected') return 'Cancelled';
  return 'Active';
}
function toneFor(bucket: ReturnType<typeof bucketFor>): 'info' | 'success' | 'error' {
  return bucket === 'Active' ? 'info' : bucket === 'Completed' ? 'success' : 'error';
}

function BookingCard({ booking }: { booking: Booking }) {
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking.tailorId));
  const bucket = bucketFor(booking.status);
  return (
    <Link to={`/customer/order/${booking.id}`}>
      <Card className="mb-3">
        <div className="flex gap-3">
          <img src={tailor?.image} alt="" className="h-14 w-14 rounded-ht-input object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ht-text">{booking.id}</p>
            <p className="truncate text-[12px] text-ht-text-secondary">{booking.category} • {booking.tailorName}</p>
            <p className="text-[12px] text-ht-text-secondary">Booked {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</p>
          </div>
          <span className="text-[15px] font-semibold text-ht-navy">₹{booking.amount}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <Badge label={bucket === 'Active' ? booking.status : bucket} tone={toneFor(bucket)} />
          <span className="text-[13px] font-semibold text-ht-ocean">View Details ›</span>
        </div>
      </Card>
    </Link>
  );
}

export default function Bookings() {
  const bookings = useCustomerBookings();
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const list = useMemo(() => (tab === 'All' ? bookings : bookings.filter((b) => bucketFor(b.status) === tab)), [bookings, tab]);

  return (
    <div>
      <h1 className="px-4 pt-4 pb-3 text-[21px] font-semibold text-ht-text sm:px-6">My Bookings</h1>
      <div className="mb-3 px-4 sm:px-6">
        <SegmentedControl options={TABS.map((t) => ({ label: t, value: t }))} value={tab} onChange={setTab} />
      </div>
      <div className="grid grid-cols-1 gap-0 px-4 sm:grid-cols-2 sm:gap-3 sm:px-6 lg:grid-cols-3">
        {list.length ? list.map((b) => <BookingCard key={b.id} booking={b} />) : (
          <div className="col-span-full">
            <EmptyState icon="📅" title="No Bookings Yet" message="You haven't placed any bookings in this category yet." />
          </div>
        )}
      </div>
    </div>
  );
}
