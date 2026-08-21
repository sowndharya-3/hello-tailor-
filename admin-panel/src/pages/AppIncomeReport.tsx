import { Download } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { incomeBreakdown } from '../data/mockData';

const COLORS = ['#0C7EBC', '#D9A441', '#173B57', '#22A06B', '#F79009', '#98A2B3'];

export default function AppIncomeReport() {
  const { show } = useToast();
  const total = incomeBreakdown.reduce((s, i) => s + i.value, 0);

  return (
    <div>
      <PageHeader title="App Income Reports" description="Platform revenue breakdown by source" actions={<Button variant="secondary" icon={<Download size={16} />} onClick={() => show('info', 'Preparing export... (UI demo)')}>Export</Button>} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Income by Source</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={incomeBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2}>
                {incomeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">Source Breakdown</h3>
          <div className="flex flex-col gap-3">
            {incomeBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 text-sm font-medium text-text-primary">{item.name}</span>
                <span className="text-sm font-semibold text-navy">₹{item.value.toLocaleString('en-IN')}</span>
                <span className="w-12 text-right text-xs text-text-secondary">{((item.value / total) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4 flex justify-between">
            <span className="text-sm font-semibold text-text-primary">Total Platform Income</span>
            <span className="text-lg font-bold text-navy">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
