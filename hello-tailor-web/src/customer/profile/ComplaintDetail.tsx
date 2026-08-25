import { useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const complaints = useStore((s) => s.complaints);
  const complaint = complaints.find((c) => c.id === id) ?? complaints[0];

  return (
    <div>
      <ScreenHeader title={`Ticket #${complaint.id}`} />
      <div className="p-4 sm:px-6">
        <div className="mb-6 rounded-ht-card border border-ht-border bg-ht-card p-4">
          <div className="flex justify-between">
            <span className="text-[16px] font-semibold text-ht-text">{complaint.category}</span>
            <Badge label={complaint.status} tone={complaint.status === 'Resolved' ? 'success' : 'warning'} />
          </div>
          <p className="mt-1 text-[12px] text-ht-text-secondary">Order: {complaint.bookingId} • Raised {new Date(complaint.submittedDate).toLocaleDateString('en-IN')}</p>
          <p className="mt-2.5 text-[14px] text-ht-text-secondary">{complaint.description}</p>
        </div>

        <p className="mb-2 text-[16px] font-semibold text-ht-text">Admin Response</p>
        <div className="mb-6 flex gap-2 rounded-ht-card bg-ht-info-bg p-4">
          <span>💬</span>
          <p className="flex-1 text-[14px] text-ht-ocean">{complaint.adminResponse || 'No response yet. Our team typically responds within 48 hours.'}</p>
        </div>

        {complaint.resolution ? (
          <>
            <p className="mb-2 text-[16px] font-semibold text-ht-text">Resolution</p>
            <div className="flex gap-2 rounded-ht-card bg-green-50 p-4">
              <span>✔️</span>
              <p className="flex-1 text-[14px] text-ht-success">{complaint.resolution}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
