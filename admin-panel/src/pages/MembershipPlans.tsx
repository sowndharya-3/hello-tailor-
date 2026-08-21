import { useState } from 'react';
import { Plus, Check, Crown, Pencil } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useToast } from '../components/ui/Toast';
import { membershipPlans as seedPlans } from '../data/mockData';
import type { MembershipPlan } from '../types';

export default function MembershipPlans() {
  const { show } = useToast();
  const [plans, setPlans] = useState(seedPlans);
  const [audience, setAudience] = useState<'Tailor' | 'Customer'>('Tailor');
  const [editing, setEditing] = useState<MembershipPlan | null>(null);
  const [creating, setCreating] = useState(false);

  const visiblePlans = plans.filter((p) => p.audience === audience);

  function toggleActive(id: string) {
    setPlans((ps) => ps.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    show('success', 'Plan status updated.');
  }

  function saveEdit(updated: MembershipPlan) {
    setPlans((ps) => ps.map((p) => p.id === updated.id ? updated : p));
    setEditing(null);
    show('success', `${updated.name} plan updated successfully.`);
  }

  return (
    <div>
      <PageHeader
        title="Membership Plan Management"
        description="Silver, Gold, Premium and Diamond tier configuration"
        actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>New Plan</Button>}
      />

      <SegmentedControl options={['Tailor', 'Customer']} active={audience} onChange={(v) => setAudience(v as 'Tailor' | 'Customer')} />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visiblePlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onToggle={() => toggleActive(plan.id)} onEdit={() => setEditing(plan)} />
        ))}
      </div>

      {(editing || creating) && (
        <PlanModal
          plan={editing}
          audience={audience}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(p) => {
            if (editing) saveEdit(p);
            else {
              setPlans((ps) => [...ps, { ...p, id: `PLN-${ps.length + 1}` }]);
              show('success', `${p.name} plan created successfully.`);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PlanCard({ plan, onToggle, onEdit }: { plan: MembershipPlan; onToggle: () => void; onEdit: () => void }) {
  const isGoldTier = plan.name === 'Gold' || plan.name === 'Diamond' || plan.name === 'Premium';
  return (
    <div
      className={`flex flex-col rounded-[20px] border-2 p-5 ${isGoldTier ? 'border-gold bg-gradient-to-b from-gold-light to-white' : 'border-border bg-card'}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-lg font-semibold text-navy">
          {isGoldTier && <Crown size={17} className="text-gold" />} {plan.name}
        </span>
        {!plan.active && <span className="rounded-full bg-disabled-bg px-2 py-0.5 text-[11px] font-semibold text-disabled-text">Inactive</span>}
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-[28px] font-bold text-navy">₹{plan.price}</span>
        <span className="mb-1 text-sm text-text-secondary">/ {plan.duration}</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {plan.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-text-primary">
            <Check size={15} className="mt-0.5 shrink-0 text-success" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3">
        {plan.featureLimits.map((f) => (
          <div key={f.label} className="flex justify-between text-xs text-text-secondary">
            <span>{f.label}</span><span className="font-medium text-text-primary">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" icon={<Pencil size={14} />} onClick={onEdit}>Edit</Button>
        <Button variant={plan.active ? 'destructive' : 'primary'} size="sm" className="flex-1" onClick={onToggle}>
          {plan.active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
      {!plan.visible && <div className="mt-2 text-center text-[11px] font-medium text-warning">Hidden from storefront</div>}
    </div>
  );
}

function PlanModal({ plan, audience, onClose, onSave }: { plan: MembershipPlan | null; audience: 'Tailor' | 'Customer'; onClose: () => void; onSave: (p: MembershipPlan) => void }) {
  const [form, setForm] = useState<MembershipPlan>(plan ?? {
    id: '', name: 'Silver', audience, price: 499, duration: '3 Months',
    benefits: [''], featureLimits: [{ label: 'Orders/month', value: '' }], visible: true, active: true, color: '#98A2B3',
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={plan ? `Edit ${plan.name} Plan` : 'Create Membership Plan'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Plan</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value as MembershipPlan['name'] })}
            options={['Silver', 'Gold', 'Premium', 'Diamond'].map((n) => ({ label: n, value: n }))} />
          <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </div>
        <Input label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <Input
          label="Benefits (comma separated)"
          value={form.benefits.join(', ')}
          onChange={(e) => setForm({ ...form, benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
        />
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Visible on storefront
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
          </label>
        </div>
      </div>
    </Modal>
  );
}
