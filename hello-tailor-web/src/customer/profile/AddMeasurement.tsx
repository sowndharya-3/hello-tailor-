import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { categories, measurementFieldsByCategory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

export default function AddMeasurement() {
  const navigate = useNavigate();
  const family = useStore((s) => s.family);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const people = [{ id: 'self', name: 'Myself' }, ...family.map((f) => ({ id: f.id, name: f.name }))];
  const [personId, setPersonId] = useState('self');
  const [category, setCategory] = useState(categories[0].name);
  const [label, setLabel] = useState('');
  const fields = measurementFieldsByCategory[category] ?? [];
  const [values, setValues] = useState<Record<string, string>>({});

  const canSave = label.trim() && fields.every((f) => values[f]?.trim());

  return (
    <div>
      <ScreenHeader title="New Measurement" />
      <div className="p-4 sm:px-6">
        <Input label="Measurement Name" placeholder="e.g. Formal Shirt Measurement" value={label} onChange={(e) => setLabel(e.target.value)} />

        <p className="mb-2 text-[14px] font-medium text-ht-text">For</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {people.map((p) => (
            <button key={p.id} onClick={() => setPersonId(p.id)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', personId === p.id ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{p.name}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Category</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.name)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', category === c.name ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{c.name}</button>
          ))}
        </div>

        {fields.map((f) => (
          <div key={f} className="mb-3">
            <p className="mb-2 text-[14px] font-medium text-ht-text">{f} (in)</p>
            <input
              value={values[f] ?? ''}
              onChange={(e) => setValues((prev) => ({ ...prev, [f]: e.target.value }))}
              placeholder="e.g. 38"
              className="w-full rounded-ht-input border-[1.5px] border-ht-border px-3.5 text-[14px] text-ht-text outline-none"
              style={{ height: 50 }}
            />
          </div>
        ))}

        <Button
          label="Save Measurement"
          disabled={!canSave}
          onClick={() => { addMeasurement({ id: `m-${Date.now()}`, label, personId, category, date: 'Today', fields: values }); navigate(-1); }}
          className="mt-2"
        />
      </div>
    </div>
  );
}
