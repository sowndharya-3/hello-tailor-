import { Link, useNavigate } from 'react-router-dom';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function Complaints() {
  const navigate = useNavigate();
  const complaints = useStore((s) => s.complaints).filter((c) => c.customerName === ME_CUSTOMER.name);

  return (
    <div>
      <ScreenHeader title="My Complaints" right={<button onClick={() => navigate('/customer/profile/complaints/new')} className="text-2xl text-ht-ocean">+</button>} />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {complaints.length ? complaints.map((item) => (
          <Link key={item.id} to={`/customer/profile/complaints/${item.id}`} className="block rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex justify-between">
              <span className="text-[15px] font-semibold text-ht-text">{item.category}</span>
              <Badge label={item.status} tone={item.status === 'Resolved' ? 'success' : 'warning'} />
            </div>
            <p className="mt-1 text-[12px] text-ht-text-secondary">Order: {item.bookingId}</p>
            <p className="mt-1.5 line-clamp-2 text-[14px] text-ht-text-secondary">{item.description}</p>
            <p className="mt-2 text-[12px] text-ht-disabled-text">Raised on {new Date(item.submittedDate).toLocaleDateString('en-IN')}</p>
          </Link>
        )) : (
          <EmptyState icon="⚠️" title="No Complaints Raised" message="If something went wrong with an order, you can raise a ticket anytime." action={<Button label="Raise a Ticket" onClick={() => navigate('/customer/profile/complaints/new')} />} />
        )}
      </div>
    </div>
  );
}
