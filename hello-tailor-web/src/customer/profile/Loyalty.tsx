import { useStore } from '@/store/useStore';
import { loyaltyHistory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';

export default function Loyalty() {
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const earned = loyaltyHistory.filter((h) => h.type === 'earned').reduce((s, h) => s + h.points, 0);
  const redeemed = Math.abs(loyaltyHistory.filter((h) => h.type === 'redeemed').reduce((s, h) => s + h.points, 0));

  return (
    <div>
      <ScreenHeader title="Loyalty Points" />
      <div className="flex gap-2.5 px-4 pt-4 pb-5 sm:px-6">
        <div className="flex-1 rounded-ht-card border border-ht-border bg-ht-card p-3.5 text-center">
          <p className="text-[18px] font-semibold text-ht-navy">{loyaltyPoints}</p>
          <p className="text-[12px] text-ht-text-secondary">Available</p>
        </div>
        <div className="flex-1 rounded-ht-card border border-ht-border bg-ht-card p-3.5 text-center">
          <p className="text-[18px] font-semibold text-ht-navy">{earned}</p>
          <p className="text-[12px] text-ht-text-secondary">Earned</p>
        </div>
        <div className="flex-1 rounded-ht-card border border-ht-border bg-ht-card p-3.5 text-center">
          <p className="text-[18px] font-semibold text-ht-navy">{redeemed}</p>
          <p className="text-[12px] text-ht-text-secondary">Redeemed</p>
        </div>
      </div>
      <div className="px-4 sm:px-6">
        <Button label="Redeem Points" variant="gold" onClick={() => window.alert('Redeem Points: 100 points = ₹50 discount on your next order.')} />
      </div>
      <p className="my-4 px-4 text-[16px] font-semibold text-ht-text sm:px-6">History</p>
      <div className="flex flex-col gap-2.5 px-4 pb-6 sm:px-6">
        {loyaltyHistory.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-ht-card border border-ht-border bg-ht-card p-4">
            <span className="text-xl">{item.type === 'earned' ? '📈' : '🎁'}</span>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-ht-text">{item.label}</p>
              <p className="text-[12px] text-ht-text-secondary">{new Date(item.date).toLocaleDateString('en-IN')}</p>
            </div>
            <span className={`text-[14px] font-bold ${item.points > 0 ? 'text-ht-success' : 'text-ht-error'}`}>{item.points > 0 ? '+' : ''}{item.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
