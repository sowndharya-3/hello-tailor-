import { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { AdminCategory } from '@/store/types';

export default function Categories() {
  const { show } = useToast();
  const categories = useStore((s) => s.adminCategories);
  const addCategory = useStore((s) => s.addCategory);
  const updateCategory = useStore((s) => s.updateCategory);
  const toggleCategoryStatus = useStore((s) => s.toggleCategoryStatus);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  function move(cat: AdminCategory, dir: -1 | 1) {
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    updateCategory(a.id, { order: b.order });
    updateCategory(b.id, { order: a.order });
  }

  function toggleStatus(cat: AdminCategory) {
    toggleCategoryStatus(cat.id);
    show('success', `${cat.name} is now ${cat.status === 'Active' ? 'inactive' : 'active'}.`);
  }

  function save(cat: AdminCategory) {
    if (editing) {
      updateCategory(cat.id, cat);
      show('success', `${cat.name} updated.`);
    } else {
      addCategory({ ...cat, id: `CAT-${categories.length}`, order: categories.length + 1 });
      show('success', `${cat.name} added.`);
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <PageHeader title="Category Management" description="Tailoring categories and subcategories" actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>Add Category</Button>} />

      <Card padded={false} className="divide-y divide-ht-border">
        {sorted.map((cat, i) => (
          <div key={cat.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(cat, -1)} className="text-ht-text-secondary hover:text-ht-navy disabled:opacity-30"><ArrowUp size={15} /></button>
              <button disabled={i === sorted.length - 1} onClick={() => move(cat, 1)} className="text-ht-text-secondary hover:text-ht-navy disabled:opacity-30"><ArrowDown size={15} /></button>
            </div>
            <img src={`https://picsum.photos/seed/${cat.imageSeed}/64`} alt="" className="h-11 w-11 rounded-xl object-cover" />
            <div className="flex-1 min-w-[160px]">
              <div className="font-semibold text-ht-text">{cat.name}</div>
              <div className="text-xs text-ht-text-secondary">{cat.subcategories.join(' · ')}</div>
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

function CategoryModal({ category, isNew, onClose, onSave }: { category: AdminCategory; isNew: boolean; onClose: () => void; onSave: (c: AdminCategory) => void }) {
  const [form, setForm] = useState<AdminCategory>(category);
  return (
    <Modal open onClose={onClose} title={isNew ? 'Add Category' : `Edit ${category.name}`} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save</Button></>}>
      <div className="flex flex-col gap-4">
        <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Subcategories (comma separated)" value={form.subcategories.join(', ')} onChange={(e) => setForm({ ...form, subcategories: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
      </div>
    </Modal>
  );
}
