import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { coupons as seedCoupons } from '../data/mockData';
import type { Coupon } from '../types';

const blankCoupon: Coupon = {
  id: '', code: '', discountType: 'Percentage', discountValue: 10, minBooking: 500, maxDiscount: 200,
  validFrom: '2026-08-21', validTo: '2026-09-21', eligibility: 'All Users', status: 'Active', usageCount: 0,
};

export default function Offers() {
  const { show } = useToast();
  const [coupons, setCoupons] = useState(seedCoupons);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Coupon | null>(null);

  function toggleStatus(c: Coupon) {
    setCoupons((cs) => cs.map((x) => x.id === c.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x));
    show('success', `${c.code} has been ${c.status === 'Active' ? 'deactivated' : 'activated'}.`);
  }

  function save(c: Coupon) {
    if (editing) {
      setCoupons((cs) => cs.map((x) => x.id === c.id ? c : x));
      show('success', `Coupon ${c.code} updated.`);
    } else {
      setCoupons((cs) => [...cs, { ...c, id: `CPN-${cs.length + 1}` }]);
      show('success', `Coupon ${c.code} created.`);
    }
    setEditing(null);
    setCreating(false);
  }

  const columns: Column<Coupon>[] = [
    { key: 'code', header: 'Coupon Code', render: (c) => <span className="font-semibold text-navy">{c.code}</span> },
    { key: 'discountType', header: 'Type' },
    { key: 'discountValue', header: 'Value', render: (c) => c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}` },
    { key: 'minBooking', header: 'Min. Booking', render: (c) => `₹${c.minBooking}` },
    { key: 'maxDiscount', header: 'Max Discount', render: (c) => `₹${c.maxDiscount}` },
    { key: 'validTo', header: 'Valid Till', sortValue: (c) => c.validTo },
    { key: 'eligibility', header: 'Eligibility' },
    { key: 'usageCount', header: 'Used', sortValue: (c) => c.usageCount },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  const actions: RowAction<Coupon>[] = [
    { label: 'Edit', onClick: (c) => setEditing(c) },
    { label: 'Activate / Deactivate', onClick: toggleStatus },
    { label: 'Delete', onClick: (c) => setDeleting(c), destructive: true },
  ];

  return (
    <div>
      <PageHeader title="Offers & Coupons" description="Manage promotional discount coupons" actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>Create Coupon</Button>} />

      <Card padded={false} className="p-4">
        <DataTable columns={columns} rows={coupons} rowKey={(c) => c.id} actions={actions} emptyTitle="No Coupons Yet" emptyDescription="Create your first coupon to start offering discounts." />
      </Card>

      {(editing || creating) && (
        <CouponModal
          coupon={editing ?? blankCoupon}
          isNew={!editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={save}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Coupon"
        message={`Are you sure you want to permanently delete ${deleting?.code}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (deleting) { setCoupons((cs) => cs.filter((c) => c.id !== deleting.id)); show('success', `${deleting.code} deleted.`); } setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function CouponModal({ coupon, isNew, onClose, onSave }: { coupon: Coupon; isNew: boolean; onClose: () => void; onSave: (c: Coupon) => void }) {
  const [form, setForm] = useState<Coupon>(coupon);
  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? 'Create Coupon' : `Edit ${coupon.code}`}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save Coupon</Button></>}
    >
      <div className="flex flex-col gap-4">
        <Input label="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Discount Type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as Coupon['discountType'] })} options={[{ label: 'Percentage', value: 'Percentage' }, { label: 'Flat', value: 'Flat' }]} />
          <Input label="Discount Value" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Min. Booking Amount (₹)" type="number" value={form.minBooking} onChange={(e) => setForm({ ...form, minBooking: Number(e.target.value) })} />
          <Input label="Max Discount (₹)" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Valid From" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
          <Input label="Valid To" type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
        </div>
        <Select label="User Eligibility" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value as Coupon['eligibility'] })}
          options={['All Users', 'New Users', 'Premium Members'].map((v) => ({ label: v, value: v }))} />
      </div>
    </Modal>
  );
}
