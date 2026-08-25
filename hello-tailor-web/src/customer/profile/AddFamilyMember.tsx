import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { clsx } from '@/components/ui/clsx';

const RELATIONSHIPS = ['Spouse', 'Son', 'Daughter', 'Mother', 'Father', 'Sibling', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function AddFamilyMember() {
  const navigate = useNavigate();
  const addFamilyMember = useStore((s) => s.addFamilyMember);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [gender, setGender] = useState(GENDERS[0]);
  const [dob, setDob] = useState('');

  return (
    <div>
      <ScreenHeader title="Add Family Member" />
      <div className="p-4 sm:px-6">
        <Input label="Full Name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />

        <p className="mb-2 text-[14px] font-medium text-ht-text">Relationship</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {RELATIONSHIPS.map((r) => (
            <button key={r} onClick={() => setRelationship(r)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', relationship === r ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{r}</button>
          ))}
        </div>

        <p className="mb-2 text-[14px] font-medium text-ht-text">Gender</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button key={g} onClick={() => setGender(g)} className={clsx('rounded-full border px-3.5 py-2.5 text-[13px] font-medium', gender === g ? 'border-ht-ocean bg-ht-ocean text-white' : 'border-ht-border bg-ht-card text-ht-text')}>{g}</button>
          ))}
        </div>

        <Input label="Date of Birth" placeholder="DD MMM YYYY" value={dob} onChange={(e) => setDob(e.target.value)} />

        <Button
          label="Save Family Member"
          disabled={!name.trim()}
          onClick={() => { addFamilyMember({ id: `f-${Date.now()}`, name, relationship, gender, dob, avatar: `https://picsum.photos/seed/${Date.now()}/200/200` }); navigate(-1); }}
          className="mt-2"
        />
      </div>
    </div>
  );
}
