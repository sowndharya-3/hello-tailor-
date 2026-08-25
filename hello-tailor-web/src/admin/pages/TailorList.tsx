import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Star } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { Tailor } from '@/store/types';

interface Props {
  typeFilter?: 'Home' | 'Shop';
  title: string;
  description: string;
}

export default function TailorList({ typeFilter, title, description }: Props) {
  const navigate = useNavigate();
  const { show } = useToast();
  const tailors = useStore((s) => s.tailors);
  const bookings = useStore((s) => s.bookings);
  const updateTailorStatus = useStore((s) => s.updateTailorStatus);
  const updateTailorVerification = useStore((s) => s.updateTailorVerification);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [confirm, setConfirm] = useState<{ t: Tailor; action: 'block' | 'approve' | 'reject' } | null>(null);

  const ordersByTailor = useMemo(() => {
    const m = new Map<string, number>();
    bookings.forEach((b) => m.set(b.tailorId, (m.get(b.tailorId) ?? 0) + 1));
    return m;
  }, [bookings]);

  const base = typeFilter ? tailors.filter((t) => t.type === typeFilter) : tailors;

  const filtered = useMemo(() => {
    return base.filter((t) => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.shopName.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || t.status === status;
      return matchSearch && matchStatus;
    });
  }, [base, search, status]);

  function applyAction() {
    if (!confirm) return;
    const { t, action } = confirm;
    if (action === 'block') updateTailorStatus(t.id, t.status === 'Blocked' ? 'Active' : 'Blocked');
    if (action === 'approve') updateTailorVerification(t.id, 'Verified');
    if (action === 'reject') updateTailorVerification(t.id, 'Rejected');
    const msg = action === 'block' ? `${t.name} has been ${t.status === 'Blocked' ? 'unblocked' : 'blocked'}.`
      : action === 'approve' ? `${t.name}'s profile has been approved.`
      : `${t.name}'s profile has been rejected.`;
    show(action === 'reject' ? 'error' : 'success', msg);
    setConfirm(null);
  }

  const columns: Column<Tailor>[] = [
    {
      key: 'name', header: 'Tailor', sortValue: (t) => t.name,
      render: (t) => (
        <div className="flex items-center gap-3">
          <Avatar src={t.image} size={36} />
          <div>
            <div className="font-semibold text-ht-text">{t.shopName}</div>
            <div className="text-xs text-ht-text-secondary">{t.id} · {t.type}</div>
          </div>
        </div>
      ),
    },
    { key: 'city', header: 'Location', render: (t) => `${t.city}, ${t.state}` },
    {
      key: 'rating', header: 'Rating', sortValue: (t) => t.rating,
      render: (t) => <span className="flex items-center gap-1 font-medium"><Star size={13} className="fill-ht-gold text-ht-gold" /> {t.rating}</span>,
    },
    { key: 'orders', header: 'Orders', sortValue: (t) => ordersByTailor.get(t.id) ?? 0, render: (t) => ordersByTailor.get(t.id) ?? 0 },
    { key: 'verification', header: 'Verification', render: (t) => <StatusBadge status={t.verification} /> },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
  ];

  const actions: RowAction<Tailor>[] = [
    { label: 'View Profile', onClick: (t) => navigate(`/admin/tailors/${t.id}`) },
    { label: 'Approve', onClick: (t) => setConfirm({ t, action: 'approve' }), hidden: (t) => t.verification === 'Verified' },
    { label: 'Reject', onClick: (t) => setConfirm({ t, action: 'reject' }), hidden: (t) => t.verification !== 'Pending', destructive: true },
    { label: 'Membership', onClick: (t) => navigate(`/admin/tailors/${t.id}?tab=Membership`) },
    { label: 'Orders / Income', onClick: (t) => navigate(`/admin/tailors/${t.id}?tab=Orders`) },
    { label: 'Block / Unblock', onClick: (t) => setConfirm({ t, action: 'block' }), destructive: true },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} actions={<Button icon={<UserPlus size={16} />}>Add Tailor</Button>} />

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64">
            <Input placeholder="Search name, shop, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-48">
            <Select
              placeholder="All Statuses"
              options={[{ label: 'Active', value: 'Active' }, { label: 'Blocked', value: 'Blocked' }, { label: 'Pending', value: 'Pending' }]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          {(search || status) && <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatus(''); }}>Clear filters</Button>}
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(t) => t.id}
          actions={actions}
          emptyTitle="No Tailors Found"
          emptyDescription="Try adjusting your search or filters, or add a new tailor."
        />
      </Card>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.action === 'block' ? (confirm.t.status === 'Blocked' ? 'Unblock Tailor' : 'Block Tailor') : confirm?.action === 'approve' ? 'Approve Tailor' : 'Reject Tailor'}
        message={
          confirm?.action === 'block'
            ? `Are you sure you want to ${confirm.t.status === 'Blocked' ? 'unblock' : 'block'} ${confirm.t.name}?`
            : confirm?.action === 'approve'
            ? `Approve ${confirm?.t.name}'s profile? They will be able to receive new orders.`
            : `Reject ${confirm?.t.name}'s profile? They will be notified and asked to resubmit documents.`
        }
        confirmLabel={confirm?.action === 'block' ? (confirm.t.status === 'Blocked' ? 'Unblock' : 'Block') : confirm?.action === 'approve' ? 'Approve' : 'Reject'}
        destructive={confirm?.action !== 'approve'}
        onConfirm={applyAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
