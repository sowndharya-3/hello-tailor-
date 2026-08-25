import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import type { Role } from '@/store/types';

const OPTIONS: { role: Role; title: string; desc: string; icon: string }[] = [
  { role: 'customer', title: "I'm a Customer", desc: 'Book tailors, track orders & shop', icon: '🧵' },
  { role: 'tailor', title: "I'm a Tailor", desc: 'Manage bookings, orders & income', icon: '✂️' },
  { role: 'admin', title: "I'm an Admin", desc: 'Manage the whole platform', icon: '🛠️' },
];

export default function RoleSelect() {
  const selectRole = useStore((s) => s.selectRole);
  const navigate = useNavigate();

  function pick(role: Role) {
    selectRole(role);
    navigate(`/${role}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center bg-ht-bg px-5 py-10">
      <h1 className="text-center text-2xl font-semibold text-ht-text">How would you like to continue?</h1>
      <p className="mt-1 text-center text-[14px] text-ht-text-secondary">You can switch roles anytime from your profile menu</p>

      <div className="mt-8 flex flex-col gap-4">
        {OPTIONS.map((opt) => (
          <button
            key={opt.role}
            onClick={() => pick(opt.role)}
            className="flex items-center gap-4 rounded-ht-card border border-ht-border bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{opt.icon}</span>
            <div>
              <p className="text-[16px] font-semibold text-ht-text">{opt.title}</p>
              <p className="text-[13px] text-ht-text-secondary">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
