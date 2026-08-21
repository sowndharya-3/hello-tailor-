import { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import { useToast } from '../components/ui/Toast';
import { categories as seedCategories } from '../data/mockData';
import type { Category } from '../types';

export default function Categories() {
  const { show } = useToast();
  const [categories, setCategories] = useState(seedCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  function move(cat: Category, dir: -1 | 1) {
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    setCategories((cs) => cs.map((c) => c.id === a.id ? { ...c, order: b.order } : c.id === b.id ? { ...c, order: a.order } : c));
  }

  function toggleStatus(cat: Category) {
    setCategories((cs) => cs.map((c) => c.id === cat.id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
    show('success', `${cat.name} is now ${cat.status === 'Active' ? 'inactive' : 'active'}.`);
  }

  function save(cat: Category) {
    if (editing) {
      setCategories((cs) => cs.map((c) => c.id === cat.id ? cat : c));
      show('success', `${cat.name} updated.`);
    } else {
      setCategories((cs) => [...cs, { ...cat, id: `CAT-${cs.length}`, order: cs.length + 1 }]);
      show('success', `${cat.name} added.`);
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <PageHeader title="Category Management" description="Tailoring categories and subcategories" actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>Add Category</Button>} />

      <Card padded={false} className="divide-y divide-border">
        {sorted.map((cat, i) => (
          <div key={cat.id} className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(cat, -1)} className="text-text-secondary hover:text-navy disabled:opacity-30"><ArrowUp size={15} /></button>
              <button disabled={i === sorted.length - 1} onClick={() => move(cat, 1)} className="text-text-secondary hover:text-navy disabled:opacity-30"><ArrowDown size={15} /></button>
            </div>
            <img src={`https://picsum.photos/seed/${cat.imageSeed}/64`} alt="" className="h-11 w-11 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-text-primary">{cat.name}</div>
              <div className="text-xs text-text-secondary">{cat.subcategories.join(' · ')}</div>
            </div>
            <StatusBadge status={cat.status} />
            <Button variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => setEditing(cat)}>Edit</Button>
            <Button variant={cat.status === 'Active' ? 'destructive' : 'primary'} size="sm" onClick={() => toggleStatus(cat)}>
              {cat.status === 'Active' ? 'Disable' : 'Enable'}
            </Button>
          </div>
        ))}
      </Card>

      {(editing || creating) && (
        <CategoryModal
          category={editing ?? { id: '', name: '', subcategories: [], imageSeed: `cat${Date.now()}`, status: 'Active', order: categories.length + 1 }}
          isNew={!editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={save}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, isNew, onClose, onSave }: { category: Category; isNew: boolean; onClose: () => void; onSave: (c: Category) => void }) {
  const [form, setForm] = useState<Category>(category);
  return (
    <Modal open onClose={onClose} title={isNew ? 'Add Category' : `Edit ${category.name}`} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save</Button></>}>
      <div className="flex flex-col gap-4">
        <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Subcategories (comma separated)" value={form.subcategories.join(', ')} onChange={(e) => setForm({ ...form, subcategories: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
      </div>
    </Modal>
  );
}
