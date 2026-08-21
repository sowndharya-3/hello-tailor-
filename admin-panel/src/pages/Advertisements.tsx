import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { advertisements as seedAds } from '../data/mockData';
import type { Advertisement } from '../types';

const blankAd: Advertisement = {
  id: '', title: '', type: 'Banner', placement: 'Home Top Banner', imageSeed: `ad${Date.now()}`,
  destination: '', startDate: '2026-08-21', endDate: '2026-09-21', status: 'Scheduled',
};

export default function Advertisements() {
  const { show } = useToast();
  const [ads, setAds] = useState(seedAds);
  const [editing, setEditing] = useState<Advertisement | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Advertisement | null>(null);

  function save(a: Advertisement) {
    if (editing) {
      setAds((xs) => xs.map((x) => x.id === a.id ? a : x));
      show('success', `${a.title} updated.`);
    } else {
      setAds((xs) => [...xs, { ...a, id: `ADV-${xs.length + 1}` }]);
      show('success', `${a.title} created.`);
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <PageHeader title="Advertisement Management" description="Tailor ads, banners and material promotions" actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>New Advertisement</Button>} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} padded={false} className="overflow-hidden">
            <img src={`https://picsum.photos/seed/${ad.imageSeed}/480/220`} alt={ad.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-navy">{ad.title}</div>
                  <div className="text-xs text-text-secondary">{ad.type} · {ad.placement}</div>
                </div>
                <StatusBadge status={ad.status} />
              </div>
              <div className="mt-2 text-xs text-text-secondary">{ad.startDate} → {ad.endDate}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setEditing(ad)}>Edit</Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => setDeleting(ad)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(editing || creating) && (
        <AdModal ad={editing ?? blankAd} isNew={!editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={save} />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Advertisement"
        message={`Are you sure you want to delete "${deleting?.title}"? This will remove it from all placements immediately.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (deleting) { setAds((xs) => xs.filter((x) => x.id !== deleting.id)); show('success', 'Advertisement deleted.'); } setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function AdModal({ ad, isNew, onClose, onSave }: { ad: Advertisement; isNew: boolean; onClose: () => void; onSave: (a: Advertisement) => void }) {
  const [form, setForm] = useState<Advertisement>(ad);
  return (
    <Modal open onClose={onClose} title={isNew ? 'Create Advertisement' : `Edit ${ad.title}`} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save</Button></>}>
      <div className="flex flex-col gap-4">
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Advertisement['type'] })} options={['Tailor Ad', 'Banner', 'Material Ad'].map((v) => ({ label: v, value: v }))} />
          <Input label="Placement" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} />
        </div>
        <Input label="Destination URL / Route" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Advertisement['status'] })} options={['Active', 'Scheduled', 'Expired', 'Paused'].map((v) => ({ label: v, value: v }))} />
      </div>
    </Modal>
  );
}
