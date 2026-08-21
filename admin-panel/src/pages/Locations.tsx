import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import DataTable, { type Column, type RowAction } from '../components/ui/DataTable';
import { useToast } from '../components/ui/Toast';
import { locations as seedLocations } from '../data/mockData';
import type { LocationEntry } from '../types';

export default function Locations() {
  const { show } = useToast();
  const [locations, setLocations] = useState(seedLocations);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ state: '', city: '' });

  function toggle(loc: LocationEntry) {
    setLocations((ls) => ls.map((l) => l.id === loc.id ? { ...l, serviceable: !l.serviceable } : l));
    show('success', `${loc.city} marked as ${loc.serviceable ? 'inactive' : 'active'}.`);
  }

  function addLocation() {
    if (!form.state || !form.city) { show('error', 'State and city are required.'); return; }
    setLocations((ls) => [...ls, { id: `LOC-${ls.length}`, state: form.state, city: form.city, serviceable: true, tailorCount: 0 }]);
    show('success', `${form.city} added as a serviceable location.`);
    setForm({ state: '', city: '' });
    setCreating(false);
  }

  const columns: Column<LocationEntry>[] = [
    { key: 'state', header: 'State', sortValue: (l) => l.state },
    { key: 'city', header: 'City', sortValue: (l) => l.city },
    { key: 'tailorCount', header: 'Tailors', sortValue: (l) => l.tailorCount },
    {
      key: 'serviceable', header: 'Status',
      render: (l) => (
        <button onClick={() => toggle(l)} className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${l.serviceable ? 'bg-success' : 'bg-disabled-bg'}`}>
          <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${l.serviceable ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      ),
    },
  ];

  const actions: RowAction<LocationEntry>[] = [{ label: 'Edit', onClick: () => show('info', 'Edit location details.') }];

  return (
    <div>
      <PageHeader title="Location Management" description="Serviceable states and cities" actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>Add Location</Button>} />
      <Card padded={false} className="p-4">
        <DataTable columns={columns} rows={locations} rowKey={(l) => l.id} actions={actions} emptyTitle="No Locations Configured" />
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="Add Location" footer={<><Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button><Button onClick={addLocation}>Add</Button></>}>
        <div className="flex flex-col gap-4">
          <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
