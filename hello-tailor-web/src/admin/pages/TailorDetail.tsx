import { useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Star, Ban, CheckCircle2, FileCheck, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';
import { formatMoney } from '../lib/helpers';

export default function TailorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') ?? 'Overview');
  const [confirm, setConfirm] = useState<'block' | 'approve' | 'reject' | null>(null);

  const tailor = useStore((s) => s.tailors.find((t) => t.id === id));
  const bookings = useStore((s) => s.bookings);
  const membershipPlans = useStore((s) => s.membershipPlans);
  const updateTailorStatus = useStore((s) => s.updateTailorStatus);
  const updateTailorVerification = useStore((s) => s.updateTailorVerification);

  const tOrders = useMemo(() => bookings.filter((b) => b.tailorId === id), [bookings, id]);
  const plan = useMemo(() => membershipPlans.find((p) => p.name === tailor?.membership && p.audience === 'Tailor'), [membershipPlans, tailor]);

  if (!tailor) {
    return <EmptyState title="Tailor not found" description="This tailor profile may have been removed." />;
  }

  const orderCols: Column<Booking>[] = [
    { key: 'id', header: 'Order ID', render: (o) => <Link to={`/admin/orders/${o.id}`} className="font-medium text-ht-ocean hover:underline">{o.id}</Link> },
    { key: 'customerName', header: 'Customer' },
    { key: 'category', header: 'Category' },
    { key: 'bookingDate', header: 'Date', sortValue: (o) => o.bookingDate },
    { key: 'amount', header: 'Amount', sortValue: (o) => o.amount, render: (o) => formatMoney(o.amount) },
    { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  function confirmAction() {
    if (!tailor) return;
    if (confirm === 'block') {
      const next = tailor.status === 'Blocked' ? 'Active' : 'Blocked';
      updateTailorStatus(tailor.id, next);
      show('success', `${tailor.name} has been ${next === 'Blocked' ? 'blocked' : 'unblocked'}.`);
    } else if (confirm === 'approve') {
      updateTailorVerification(tailor.id, 'Verified');
      show('success', `${tailor.name}'s profile has been approved.`);
    } else if (confirm === 'reject') {
      updateTailorVerification(tailor.id, 'Rejected');
      show('error', `${tailor.name}'s profile has been rejected.`);
    }
    setConfirm(null);
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ht-text-secondary hover:text-ht-navy">
        <ArrowLeft size={16} /> Back
      </button>

      <Card className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={tailor.image} size={64} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-ht-navy">{tailor.shopName}</h1>
                <StatusBadge status={tailor.status} />
                <StatusBadge status={tailor.verification} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ht-text-secondary">
                <span className="flex items-center gap-1"><Phone size={13} /> {tailor.phone}</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {tailor.email}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {tailor.city}, {tailor.state}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> Joined {tailor.joinedDate}</span>
                <span className="flex items-center gap-1"><Star size={13} className="fill-ht-gold text-ht-gold" /> {tailor.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={tailor.status === 'Blocked' ? 'primary' : 'destructive'} icon={tailor.status === 'Blocked' ? <CheckCircle2 size={16} /> : <Ban size={16} />} onClick={() => setConfirm('block')}>
              {tailor.status === 'Blocked' ? 'Unblock' : 'Block'}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-ht-border pt-5 sm:grid-cols-4">
          <Stat label="Total Orders" value={tOrders.length.toString()} />
          <Stat label="Total Income" value={formatMoney(tailor.income)} />
          <Stat label="Commission Paid" value={formatMoney(tailor.commissionPaid)} />
          <Stat label="Experience" value={`${tailor.experienceYears} yrs`} />
        </div>
      </Card>

      {tailor.verification === 'Pending' && (
        <Card className="mb-5 border-ht-warning/40 bg-[#FFFAEB]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileCheck size={20} className="mt-0.5 text-ht-warning" />
              <div>
                <div className="font-semibold text-ht-navy">Verification Pending</div>
                <p className="text-sm text-ht-text-secondary">This tailor has submitted KYC documents and is awaiting admin approval before they can accept orders.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" icon={<XCircle size={15} />} onClick={() => setConfirm('reject')}>Reject</Button>
              <Button variant="primary" size="sm" icon={<CheckCircle2 size={15} />} onClick={() => setConfirm('approve')}>Approve</Button>
            </div>
          </div>
        </Card>
      )}

      <Card padded={false} className="p-5">
        <Tabs tabs={['Overview', 'Orders', 'Membership']} active={tab} onChange={setTab} />
        <div className="pt-5">
          {tab === 'Overview' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ht-border p-4">
                <div className="mb-2 text-sm font-semibold text-ht-navy">Specializations</div>
                <div className="flex flex-wrap gap-2">
                  {tailor.categories.map((c) => (
                    <span key={c} className="rounded-full bg-ht-info-bg px-2.5 py-1 text-xs font-medium text-ht-ocean">{c}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-ht-border p-4">
                <div className="mb-2 text-sm font-semibold text-ht-navy">Tailor Type</div>
                <p className="text-sm text-ht-text-secondary">{tailor.shopName} operates as a <b className="text-ht-text">{tailor.type}</b> tailor.</p>
              </div>
            </div>
          )}
          {tab === 'Orders' && <DataTable columns={orderCols} rows={tOrders} rowKey={(o) => o.id} emptyTitle="No Orders" emptyDescription="This tailor hasn't received any orders yet." />}
          {tab === 'Membership' && (
            plan ? (
              <div className="rounded-xl border border-ht-border p-4 max-w-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ht-navy">{plan.name} Plan</span>
                  <StatusBadge status="Active" />
                </div>
                <div className="mt-2 text-sm text-ht-text-secondary">{plan.duration} · {plan.benefits.join(', ')}</div>
                <div className="mt-1 text-sm text-ht-text-secondary">Price: {formatMoney(plan.price)}</div>
              </div>
            ) : <EmptyState title="No Active Membership" description="This tailor has not subscribed to any membership plan." />
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={!!confirm}
        title={confirm === 'block' ? (tailor.status === 'Blocked' ? 'Unblock Tailor' : 'Block Tailor') : confirm === 'approve' ? 'Approve Tailor' : 'Reject Tailor'}
        message={
          confirm === 'block' ? `Are you sure you want to ${tailor.status === 'Blocked' ? 'unblock' : 'block'} ${tailor.name}?`
          : confirm === 'approve' ? `Approve ${tailor.name}'s profile? They will be able to receive new orders.`
          : `Reject ${tailor.name}'s profile? They will be notified and asked to resubmit documents.`
        }
        confirmLabel={confirm === 'block' ? (tailor.status === 'Blocked' ? 'Unblock' : 'Block') : confirm === 'approve' ? 'Approve' : 'Reject'}
        destructive={confirm !== 'approve'}
        onConfirm={confirmAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-ht-text-secondary">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-ht-navy">{value}</div>
    </div>
  );
}
