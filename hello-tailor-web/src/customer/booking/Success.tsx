import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function BookingSuccess() {
  const { tailorId } = useParams<{ tailorId: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get('id');
  const failed = params.get('failed');

  if (failed === '1') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8">
        <EmptyState
          icon="❌"
          title="Payment Failed"
          message="We couldn't process your payment. No amount was deducted. Please try again."
          action={<Button label="Retry Payment" onClick={() => navigate(`/customer/booking/${tailorId}/payment`, { replace: true })} />}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <span className="mb-4 text-6xl">✅</span>
      <h1 className="text-[22px] font-semibold text-ht-text">Request Submitted</h1>
      <p className="mt-2 text-[14px] text-ht-text-secondary">Your stitching request is awaiting tailor review. No payment has been collected. We’ll notify you when the quotation is ready.</p>

      <div className="mt-6 w-full max-w-sm rounded-ht-card border border-ht-border bg-ht-card p-5 text-center">
        <p className="text-[12px] text-ht-text-secondary">Request ID</p>
        <p className="mt-1 text-[16px] font-semibold text-ht-navy">{id ?? '—'}</p>
      </div>

      <div className="mt-5 w-full max-w-sm">
        <Button label="View Request" onClick={() => navigate(id ? `/customer/order/${id}` : '/customer/bookings', { replace: true })} />
      </div>
      <div className="mt-3 w-full max-w-sm">
        <Button label="Back to Home" variant="secondary" onClick={() => navigate('/customer', { replace: true })} />
      </div>
    </div>
  );
}
