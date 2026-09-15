import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { clsx } from '@/components/ui/clsx';

function NavRow({ to, icon, label, sub, tone = 'default', badge }: { to: string; icon: string; label: string; sub?: string; tone?: 'default' | 'gold' | 'destructive'; badge?: string }) {
  const iconBg = tone === 'gold' ? 'bg-ht-gold-light' : tone === 'destructive' ? 'bg-red-50' : 'bg-ht-info-bg';
  return (
    <Link to={to} className="flex items-center gap-3 border-b border-ht-border py-3.5 last:border-b-0">
      <div className={clsx('flex h-9.5 w-9.5 items-center justify-center rounded-ht-input text-lg', iconBg)} style={{ width: 38, height: 38 }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-[14px] font-medium', tone === 'destructive' ? 'text-ht-error' : 'text-ht-text')}>{label}</p>
        {sub ? <p className="text-[12px] text-ht-text-secondary">{sub}</p> : null}
      </div>
      {badge ? <span className="mr-1 rounded-full bg-ht-gold px-2 py-0.5 text-[10px] font-semibold text-white">{badge}</span> : null}
      <span className="text-ht-disabled-text">›</span>
    </Link>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const phone = useStore((s) => s.phone);
  const language = useStore((s) => s.language);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const logout = useStore((s) => s.logout);
  const switchRole = useStore((s) => s.switchRole);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => { setConfirmOpen(false); logout(); navigate('/login', { replace: true }); };
  const doSwitchRole = () => { switchRole(); navigate('/role-select', { replace: true }); };

  return (
    <div className="mx-auto max-w-3xl pb-8">
      <h1 className="px-4 pt-4 pb-3 text-[21px] font-semibold text-ht-text sm:px-6">Profile</h1>

      <Card className="mx-4 flex items-center gap-3.5 sm:mx-6">
        <Avatar src="https://picsum.photos/seed/me-avatar/200/200" size={60} />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-ht-text">Sowndharya Rajan</p>
          <p className="text-[12px] text-ht-text-secondary">+91 {phone || '98765 43210'}</p>
          <p className="truncate text-[12px] text-ht-text-secondary">seoclaude011@gmail.com</p>
        </div>
      </Card>

      <p className="mx-4 mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary sm:mx-6">Account</p>
      <Card className="mx-4 sm:mx-6" >
        <NavRow to="/customer/profile/addresses" icon="📍" label="Addresses" sub="Manage delivery & pickup addresses" />
        <NavRow to="/customer/profile/family" icon="👨‍👩‍👧" label="Family Members" sub="Book for family with saved details" />
        <NavRow to="/customer/profile/measurements" icon="📏" label="Measurements" sub="View & manage saved measurements" />
        <NavRow to="/customer/bookings" icon="🧾" label="Orders" sub="Track and view order history" />
        <NavRow to="/customer/profile/offers" icon="🏷️" label="Offers & Coupons" />
      </Card>

      <p className="mx-4 mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary sm:mx-6">Rewards</p>
      <Card className="mx-4 sm:mx-6">
        <NavRow to="/customer/profile/membership" icon="🎖️" label="Hello Tailor Membership" tone="gold" />
        <NavRow to="/customer/profile/loyalty" icon="⭐" label="Loyalty Points" sub={`${loyaltyPoints} points available`} />
        <NavRow to="/customer/profile/referral" icon="🎁" label="Refer & Earn" />
      </Card>

      <p className="mx-4 mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary sm:mx-6">Explore</p>
      <Card className="mx-4 sm:mx-6">
        <NavRow to="/customer/store/material" icon="🏬" label="Tailoring Material Store" badge="NEW" />
        <NavRow to="/customer/store/readymade" icon="👕" label="Readymade Dress Store" badge="NEW" />
        <NavRow to="/customer/ai-design" icon="✨" label="AI Design Suggestions" badge="BETA" />
      </Card>

      <p className="mx-4 mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary sm:mx-6">Support</p>
      <Card className="mx-4 sm:mx-6">
        <NavRow to="/customer/profile/support" icon="🛟" label="Help & Support" />
        <NavRow to="/customer/profile/complaints" icon="⚠️" label="My Complaints" />
        <NavRow to="/customer/profile/language" icon="🌐" label="Language" sub={language} />
      </Card>

      <p className="mx-4 mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-ht-text-secondary sm:mx-6">Session</p>
      <Card className="mx-4 sm:mx-6">
        <button onClick={doSwitchRole} className="flex w-full items-center gap-3 py-3.5 text-left">
          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-ht-input bg-ht-info-bg text-lg" style={{ width: 38, height: 38 }}>🔀</div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-ht-text">Switch Role</p>
            <p className="text-[12px] text-ht-text-secondary">Go back to role selection</p>
          </div>
          <span className="text-ht-disabled-text">›</span>
        </button>
      </Card>

      <div className="mx-4 mt-6 sm:mx-6">
        <Button label="Logout" variant="secondary" onClick={() => setConfirmOpen(true)} />
      </div>
      <p className="mt-4 text-center text-[12px] text-ht-disabled-text">Hello Tailor v1.0.0</p>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Logout?">
        <p className="text-[14px] text-ht-text-secondary">Are you sure you want to logout of Hello Tailor?</p>
        <div className="mt-5 flex gap-2.5">
          <Button label="Cancel" variant="secondary" onClick={() => setConfirmOpen(false)} />
          <Button label="Logout" variant="destructive" onClick={doLogout} />
        </div>
      </Modal>
    </div>
  );
}
