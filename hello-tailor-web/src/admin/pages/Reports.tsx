import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Activity, Download, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const reportLinks = [
  { title: 'Sales Report', description: 'Daily, monthly and yearly sales performance with booking count and AOV.', icon: TrendingUp, path: '/admin/reports/sales' },
  { title: 'Tailor Income Reports', description: 'Gross earnings, commission and net earnings broken down by tailor.', icon: PieChart, path: '/admin/reports/tailor-income' },
  { title: 'App Income Reports', description: 'Platform income by source: commissions, memberships, ads and more.', icon: PieChart, path: '/admin/reports/app-income' },
  { title: 'Analytics', description: 'Registrations, retention, conversion and marketplace health metrics.', icon: Activity, path: '/admin/analytics' },
];

export default function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports Dashboard"
        description="Central hub for all Hello Tailor performance reports"
        actions={<Button variant="secondary" icon={<Download size={16} />}>Export All</Button>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reportLinks.map((r) => (
          <Link key={r.path} to={r.path}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ht-ocean/10 text-ht-ocean"><r.icon size={20} /></div>
                <ArrowRight size={18} className="text-ht-text-secondary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ht-navy">{r.title}</h3>
              <p className="mt-1 text-sm text-ht-text-secondary">{r.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
