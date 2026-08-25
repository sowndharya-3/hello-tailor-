import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function Family() {
  const navigate = useNavigate();
  const family = useStore((s) => s.family);
  const measurements = useStore((s) => s.measurements);

  return (
    <div>
      <ScreenHeader title="Family Members" right={<button onClick={() => navigate('/customer/profile/family/add')} className="text-2xl text-ht-ocean">+</button>} />
      <div className="flex flex-col gap-3 p-4 sm:px-6">
        {family.length ? family.map((item) => {
          const m = measurements.filter((x) => x.personId === item.id);
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
              <Avatar src={item.avatar} size={52} />
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-ht-text">{item.name}</p>
                <p className="text-[12px] text-ht-text-secondary">{item.relationship} • {item.gender} • DOB {item.dob}</p>
                <p className="text-[12px] text-ht-text-secondary">{m.length} saved measurement(s)</p>
              </div>
              <span className="text-ht-disabled-text">›</span>
            </div>
          );
        }) : (
          <EmptyState icon="👨‍👩‍👧" title="No Family Members" message="Add family members to book for them and save their measurements." action={<Button label="Add Family Member" onClick={() => navigate('/customer/profile/family/add')} />} />
        )}
      </div>
    </div>
  );
}
