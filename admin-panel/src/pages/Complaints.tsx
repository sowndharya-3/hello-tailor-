import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { complaints as seedComplaints } from '../data/mockData';
import type { Complaint } from '../types';

export default function Complaints() {
  const { show } = useToast();
  const [complaints, setComplaints] = useState(seedComplaints);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');

  const filtered = useMemo(() => complaints.filter((c) =>
    (!status || c.status === status) && (!priority || c.priority === priority)
  ), [complaints, status, priority]);

  function resolve() {
    if (!selected) return;
    setComplaints((cs) => cs.map((c) => c.ticketId === selected.ticketId ? { ...c, status: 'Resolved', resolution: response || c.resolution, assignedAdmin: c.assignedAdmin === 'Unassigned' ? 'Ritu Sinha' : c.assignedAdmin } : c));
    show('success', `Ticket ${selected.ticketId} marked as resolved.`);
    setSelected(null);
    setResponse('');
  }

  const columns: Column<Complaint>[] = [
    { key: 'ticketId', header: 'Ticket ID' },
    { key: 'customerName', header: 'Customer' },
    { key: 'orderId', header: 'Order' },
    { key: 'category', header: 'Category' },
    { key: 'submittedDate', header: 'Submitted', sortValue: (c) => c.submittedDate },
    { key: 'priority', header: 'Priority', render: (c) => <StatusBadge status={c.priority} /> },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    { key: 'assignedAdmin', header: 'Assigned To' },
  ];

  const actions: RowAction<Complaint>[] = [
    { label: 'View / Respond', onClick: (c) => { setSelected(c); setResponse(c.resolution); } },
  ];

  return (
    <div>
      <PageHeader title="Complaint Management" description="Track and resolve customer support tickets" />
      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="w-48"><Select placeholder="All Status" value={status} onChange={(e) => setStatus(e.target.value)} options={['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => ({ label: s, value: s }))} /></div>
          <div className="w-48"><Select placeholder="All Priorities" value={priority} onChange={(e) => setPriority(e.target.value)} options={['Low', 'Medium', 'High', 'Urgent'].map((s) => ({ label: s, value: s }))} /></div>
          {(status || priority) && <Button variant="ghost" size="sm" onClick={() => { setStatus(''); setPriority(''); }}>Clear filters</Button>}
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(c) => c.ticketId} actions={actions} emptyTitle="No Complaints Found" />
      </Card>

      {selected && (
        <Modal
          open
          onClose={() => setSelected(null)}
          title={`${selected.ticketId} · ${selected.category}`}
          width="max-w-xl"
          footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button><Button onClick={resolve}>Mark as Resolved</Button></>}
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-text-secondary">Customer</div><div className="font-medium text-text-primary">{selected.customerName}</div></div>
              <div><div className="text-text-secondary">Order</div><div className="font-medium text-text-primary">{selected.orderId}</div></div>
              <div><div className="text-text-secondary">Priority</div><StatusBadge status={selected.priority} /></div>
              <div><div className="text-text-secondary">Status</div><StatusBadge status={selected.status} /></div>
            </div>
            <div className="rounded-xl border border-border p-3 text-sm text-text-secondary">{selected.description}</div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Resolution Notes</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                placeholder="Enter response / resolution details..."
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
