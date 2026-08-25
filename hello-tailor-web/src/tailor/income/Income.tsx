// Ported from hello-tailor-app/app/(tailor)/(tabs)/income.tsx. Weekly/monthly breakdown chart
// data stays mocked (matches source app), only the top-line totals come from real bookings.
import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { BarChart } from '@/components/ui/Chart';
import { useMyBookings } from '@/store/useStore';
import { formatCurrency } from '../lib/status';

const PERIODS = ['Today', 'This Week', 'This Month', 'Custom'].map((p) => ({ label: p, value: p }));

const WEEK_DATA = [1200, 1800, 900, 2400, 1600, 3100, 2000];
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_DATA = [8200, 10400, 7600, 12100];
const MONTH_LABELS = ['W1', 'W2', 'W3', 'W4'];

export default function Income() {
  const bookings = useMyBookings();
  const [period, setPeriod] = useState('This Week');
  const completed = bookings.filter((b) => b.status === 'Delivered');

  const stats = useMemo(() => {
    const gross = completed.reduce((sum, b) => sum + b.amount, 0);
    const commission = Math.round(gross * 0.1);
    return { bookings: completed.length, gross, commission, net: gross - commission };
  }, [completed]);

  const chartData = period === 'This Month' ? MONTH_DATA : WEEK_DATA;
  const chartLabels = period === 'This Month' ? MONTH_LABELS : WEEK_LABELS;

  return (
    <div>
      <ScreenHeader title="Income Report" back={false} />
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        <SegmentedControl options={PERIODS} value={period} onChange={setPeriod} />

        <Card>
          <p className="text-[13px] font-medium text-ht-text-secondary">Net Income ({period})</p>
          <p className="mb-4 mt-1 text-[28px] font-bold text-ht-text">{formatCurrency(stats.net)}</p>
          <div className="grid grid-cols-3 gap-2 border-t border-ht-border pt-3">
            <Stat label="Total Bookings" value={String(stats.bookings)} />
            <Stat label="Gross Amount" value={formatCurrency(stats.gross)} />
            <Stat label="Commission (10%)" value={formatCurrency(stats.commission)} />
          </div>
        </Card>

        <h2 className="mt-2 font-semibold text-ht-text">{period === 'This Month' ? 'Weekly Breakdown' : 'Daily Breakdown'}</h2>
        <Card>
          <div className="flex flex-col items-center">
            <BarChart data={chartData} width={320} height={110} />
            <div className="mt-1 flex w-full justify-between px-1 text-[11px] text-ht-text-secondary">
              {chartLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </Card>

        <h2 className="mt-2 font-semibold text-ht-text">Recent Payouts</h2>
        <div className="flex flex-col gap-2">
          {completed.slice(0, 6).map((b) => (
            <Card key={b.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ht-text">{b.customerName}</p>
                <p className="text-[11px] text-ht-text-secondary">{b.category} · {b.id}</p>
              </div>
              <p className="font-semibold text-ht-success">+{formatCurrency(b.amount)}</p>
            </Card>
          ))}
          {completed.length === 0 && <p className="text-[13px] text-ht-text-secondary">No completed orders yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-ht-text">{value}</p>
      <p className="mt-0.5 text-[11px] text-ht-text-secondary">{label}</p>
    </div>
  );
}
