import { referrals } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const CODE = 'SOWND2026';

export default function Referral() {
  const totalReward = referrals.reduce((s, r) => s + r.reward, 0);

  return (
    <div>
      <ScreenHeader title="Refer & Earn" />
      <div className="px-4 sm:px-6">
        <div className="flex flex-col items-center gap-1.5 rounded-ht-premium border border-ht-gold bg-ht-gold-light p-6 text-center">
          <span className="text-3xl">🎁</span>
          <p className="mt-1 text-[18px] font-semibold text-ht-text">Give ₹100, Get ₹100</p>
          <p className="text-[14px] text-ht-text-secondary">Invite friends to Hello Tailor. They get ₹100 off their first order, you get ₹100 credited to your wallet.</p>
          <div className="mt-3 flex items-center gap-2.5 rounded-full border border-ht-border bg-white px-4.5 py-2.5">
            <span className="text-[14px] font-bold tracking-wide text-ht-navy">{CODE}</span>
            <button onClick={() => { navigator.clipboard?.writeText(CODE); window.alert('Copied: Referral code copied to clipboard.'); }}>📋</button>
          </div>
          <div className="mt-3 w-full"><Button label="Share Invite Link" onClick={() => window.alert('Share: Invite link shared (mock).')} /></div>
        </div>

        <div className="mt-4 flex gap-2.5">
          <div className="flex-1 rounded-ht-card border border-ht-border bg-ht-card p-3.5 text-center">
            <p className="text-[18px] font-semibold text-ht-navy">{referrals.filter((r) => r.status === 'Joined').length}</p>
            <p className="text-[12px] text-ht-text-secondary">Successful Referrals</p>
          </div>
          <div className="flex-1 rounded-ht-card border border-ht-border bg-ht-card p-3.5 text-center">
            <p className="text-[18px] font-semibold text-ht-navy">₹{totalReward}</p>
            <p className="text-[12px] text-ht-text-secondary">Rewards Earned</p>
          </div>
        </div>
      </div>

      <p className="my-4 px-4 text-[16px] font-semibold text-ht-text sm:px-6">Referral History</p>
      <div className="flex flex-col gap-2.5 px-4 pb-6 sm:px-6">
        {referrals.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5 rounded-ht-card border border-ht-border bg-ht-card p-4">
            <div className="flex-1">
              <p className="text-[14px] font-medium text-ht-text">{item.name}</p>
              <p className="text-[12px] text-ht-text-secondary">{new Date(item.date).toLocaleDateString('en-IN')}</p>
            </div>
            <Badge label={item.status} tone={item.status === 'Joined' ? 'success' : 'warning'} />
            {item.reward ? <span className="text-[14px] font-bold text-ht-success">+₹{item.reward}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
