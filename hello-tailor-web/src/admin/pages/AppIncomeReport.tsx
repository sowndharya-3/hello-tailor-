import { useMemo } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import { formatMoney } from '../lib/helpers';

const COLORS = ['#0C7EBC', '#D9A441', '#173B57', '#22A06B', '#F79009', '#98A2B3'];

export default function AppIncomeReport() {
  const { show } = useToast();
  const commissions = useStore((s) => s.commissions);
  const tailors = useStore((s) => s.tailors);
  const customers = useStore((s) => s.customers);
  const membershipPlans = useStore((s) => s.membershipPlans);
  const advertisements = useStore((s) => s.advertisements);

  const breakdown = useMemo(() => {
    const priceOf = (name: string, audience: 'Tailor' | 'Customer') => membershipPlans.find((p) => p.name === name && p.audience === audience)?.price ?? 0;
    const commission = commissions.reduce((s, c) => s + c.commissionAmount, 0);
    const memberships = tailors.filter((t) => t.membership !== 'None').reduce((s, t) => s + priceOf(t.membership, 'Tailor'), 0)
      + customers.filter((c) => c.membership !== 'None').reduce((s, c) => s + priceOf(c.membership, 'Customer'), 0);
    const ads = advertisements.filter((a) => a.status === 'Active').length * 4500;
    return [
      { name: 'Booking Commission', value: commission },
      { name: 'Memberships', value: memberships },
      { name: 'Advertisements', value: ads },
    ].filter((i) => i.value > 0);
  }, [commissions, tailors, customers, membershipPlans, advertisements]);

  const total = breakdown.reduce((s, i) => s + i.value, 0) || 1;

  return (
    <div>
      <PageHeader title="App Income Reports" description="Platform revenue breakdown by source" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={() => show('info', 'Preparing export... (UI demo)')}>Export</Button>} />

      <Card>
        <h3 className="mb-4 text-base font-semibold text-ht-navy">Source Breakdown</h3>
        <div className="flex flex-col gap-3">
          {breakdown.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="w-40 shrink-0 text-sm font-medium text-ht-text">{item.name}</span>
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div className="h-2 rounded-full" style={{ width: `${(item.value / total) * 100}%`, background: COLORS[i % COLORS.length] }} />
              </div>
              <span className="w-24 shrink-0 text-right text-sm font-semibold text-ht-navy">{formatMoney(item.value)}</span>
              <span className="w-12 shrink-0 text-right text-xs text-ht-text-secondary">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
          {breakdown.length === 0 && <p className="text-sm text-ht-text-secondary">No income recorded yet.</p>}
        </div>
        <div className="mt-4 border-t border-ht-border pt-4 flex justify-between">
          <span className="text-sm font-semibold text-ht-text">Total Platform Income</span>
          <span className="text-lg font-bold text-ht-navy">{formatMoney(total === 1 && breakdown.length === 0 ? 0 : total)}</span>
        </div>
      </Card>
    </div>
  );
}
