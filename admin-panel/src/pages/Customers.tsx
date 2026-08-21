import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { customers as seedCustomers } from '../data/mockData';
import type { Customer } from '../types';

export default function Customers() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [customers, setCustomers] = useState(seedCustomers);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search) || c.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || c.status === status;
      return matchSearch && matchStatus;
    });
  }, [customers, search, status]);

  function toggleBlock(c: Customer) {
    setCustomers((cs) => cs.map((x) => x.id === c.id ? { ...x, status: x.status === 'Blocked' ? 'Active' : 'Blocked' } : x));
    show('success', `${c.name} has been ${c.status === 'Blocked' ? 'unblocked' : 'blocked'}.`);
    setConfirmTarget(null);
  }

  const columns: Column<Customer>[] = [
    {
      key: 'name', header: 'Customer', sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar seed={c.avatarSeed} />
          <div>
            <div className="font-semibold text-text-primary">{c.name}</div>
            <div className="text-xs text-text-secondary">{c.id}</div>
          </div>
        </div>
      ),
    },
    { key: 'mobile', header: 'Mobile' },
    { key: 'location', header: 'Location', render: (c) => `${c.city}, ${c.state}` },
    { key: 'joinedDate', header: 'Joined', sortValue: (c) => c.joinedDate },
    { key: 'orders', header: 'Orders', sortValue: (c) => c.orders },
    {
      key: 'membership', header: 'Membership',
      render: (c) => c.membership === 'None' ? <span className="text-text-secondary text-xs">None</span> : (
        <span className="rounded-full bg-gold-light px-2.5 py-1 text-xs font-semibold text-gold">{c.membership}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  const actions: RowAction<Customer>[] = [
    { label: 'View Profile', onClick: (c) => navigate(`/customers/${c.id}`) },
    { label: 'Edit', onClick: (c) => navigate(`/customers/${c.id}?edit=1`) },
    { label: 'Order History', onClick: (c) => navigate(`/customers/${c.id}?tab=Orders`) },
    { label: 'Payment History', onClick: (c) => navigate(`/customers/${c.id}?tab=Payments`) },
    { label: 'Block / Unblock', onClick: (c) => setConfirmTarget(c), destructive: true },
  ];

  return (
    <div>
      <PageHeader
        title="Customer Management"
        description={`${customers.length} registered customers`}
        actions={<Button icon={<UserPlus size={16} />}>Add Customer</Button>}
      />

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-64">
            <Input placeholder="Search name, mobile, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-48">
            <Select
              placeholder="All Statuses"
              options={[{ label: 'Active', value: 'Active' }, { label: 'Blocked', value: 'Blocked' }, { label: 'Pending', value: 'Pending' }]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          {(search || status) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatus(''); }}>Clear filters</Button>
          )}
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(c) => c.id}
          actions={actions}
          emptyTitle="No Customers Found"
          emptyDescription="Try adjusting your search or filters, or add a new customer."
        />
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        title={confirmTarget?.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
        message={`Are you sure you want to ${confirmTarget?.status === 'Blocked' ? 'unblock' : 'block'} ${confirmTarget?.name}? ${confirmTarget?.status !== 'Blocked' ? 'They will lose access to place new orders.' : ''}`}
        confirmLabel={confirmTarget?.status === 'Blocked' ? 'Unblock' : 'Block'}
        destructive={confirmTarget?.status !== 'Blocked'}
        onConfirm={() => confirmTarget && toggleBlock(confirmTarget)}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
