import { useState } from 'react';
import { Plus, Check, Crown, Pencil } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { MembershipPlan } from '@/store/types';
import { formatMoney } from '../lib/helpers';

export default function MembershipPlans() {
  const { show } = useToast();
  const plans = useStore((s) => s.membershipPlans);
  const addMembershipPlan = useStore((s) => s.addMembershipPlan);
  const updateMembershipPlan = useStore((s) => s.updateMembershipPlan);
  const [audience, setAudience] = useState<'Tailor' | 'Customer'>('Tailor');
  const [editing, setEditing] = useState<MembershipPlan | null>(null);
  const [creating, setCreating] = useState(false);

  const visiblePlans = plans.filter((p) => p.audience === audience);

  function saveEdit(updated: MembershipPlan) {
    updateMembershipPlan(updated.id, updated);
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
          <PlanCard key={plan.id} plan={plan} onEdit={() => setEditing(plan)} />
        ))}
        {visiblePlans.length === 0 && <p className="text-sm text-ht-text-secondary">No {audience.toLowerCase()} plans yet.</p>}
      </div>

      {(editing || creating) && (
        <PlanModal
          plan={editing}
          audience={audience}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(p) => {
            if (editing) saveEdit(p);
            else {
              addMembershipPlan({ ...p, id: `PLN-${plans.length + 1}` });
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

function PlanCard({ plan, onEdit }: { plan: MembershipPlan; onEdit: () => void }) {
  const isGoldTier = plan.name === 'Gold' || plan.name === 'Diamond' || plan.name === 'Premium';
  return (
    <div className={`flex flex-col rounded-[20px] border-2 p-5 ${isGoldTier ? 'border-ht-gold bg-gradient-to-b from-ht-gold-light to-white' : 'border-ht-border bg-ht-card'}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-lg font-semibold text-ht-navy">
          {isGoldTier && <Crown size={17} className="text-ht-gold" />} {plan.name}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-[28px] font-bold text-ht-navy">{formatMoney(plan.price)}</span>
        <span className="mb-1 text-sm text-ht-text-secondary">/ {plan.duration}</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {plan.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-ht-text">
            <Check size={15} className="mt-0.5 shrink-0 text-ht-success" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" icon={<Pencil size={14} />} onClick={onEdit}>Edit</Button>
      </div>
    </div>
  );
}

function PlanModal({ plan, audience, onClose, onSave }: { plan: MembershipPlan | null; audience: 'Tailor' | 'Customer'; onClose: () => void; onSave: (p: MembershipPlan) => void }) {
  const [form, setForm] = useState<MembershipPlan>(plan ?? {
    id: '', name: 'Silver', audience, price: 499, duration: '3 Months', benefits: [''], color: '#98A2B3',
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
      </div>
    </Modal>
  );
}
