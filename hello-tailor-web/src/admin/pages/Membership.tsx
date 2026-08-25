import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useStore } from '@/store/useStore';
import { formatMoney } from '../lib/helpers';

// ponytail: the store only keeps each user's *current* membership tier (Customer.membership /
// Tailor.membership), not a history of individual purchase records — so "membership records"
// here are derived live from whoever currently holds a paid tier, one row per member.
interface MembershipRow {
  id: string;
  userType: 'Tailor' | 'Customer';
  userName: string;
  plan: string;
  joinedDate: string;
  status: 'Active';
  amountPaid: number;
}

export default function Membership() {
  const customers = useStore((s) => s.customers);
  const tailors = useStore((s) => s.tailors);
  const membershipPlans = useStore((s) => s.membershipPlans);
  const [userType, setUserType] = useState('All');
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');

  const records: MembershipRow[] = useMemo(() => {
    const priceOf = (name: string, audience: 'Tailor' | 'Customer') => membershipPlans.find((p) => p.name === name && p.audience === audience)?.price ?? 0;
    const tRows: MembershipRow[] = tailors.filter((t) => t.membership !== 'None').map((t) => ({
      id: `MEM-T-${t.id}`, userType: 'Tailor', userName: t.name, plan: t.membership, joinedDate: t.joinedDate, status: 'Active', amountPaid: priceOf(t.membership, 'Tailor'),
    }));
    const cRows: MembershipRow[] = customers.filter((c) => c.membership !== 'None').map((c) => ({
      id: `MEM-C-${c.id}`, userType: 'Customer', userName: c.name, plan: c.membership, joinedDate: c.joinedDate, status: 'Active', amountPaid: priceOf(c.membership, 'Customer'),
    }));
    return [...tRows, ...cRows];
  }, [tailors, customers, membershipPlans]);

  const filtered = useMemo(() => records.filter((m) =>
    (userType === 'All' || m.userType === userType) &&
    (!search || m.userName.toLowerCase().includes(search.toLowerCase())) &&
    (!plan || m.plan === plan)
  ), [records, userType, search, plan]);

  const active = records.length;
  const revenue = records.reduce((s, m) => s + m.amountPaid, 0);

  const columns: Column<MembershipRow>[] = [
    { key: 'id', header: 'Membership ID' },
    { key: 'userType', header: 'Type' },
    { key: 'userName', header: 'Name' },
    { key: 'plan', header: 'Plan', render: (m) => <span className="rounded-full bg-ht-gold-light px-2.5 py-1 text-xs font-semibold text-ht-gold">{m.plan}</span> },
    { key: 'joinedDate', header: 'Since', sortValue: (m) => m.joinedDate },
    { key: 'amountPaid', header: 'Plan Price', sortValue: (m) => m.amountPaid, render: (m) => formatMoney(m.amountPaid) },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Membership Management" description="Tailor and customer membership overview" />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-ht-text-secondary">Active Memberships</div><div className="mt-1 text-2xl font-bold text-ht-navy">{active}</div></Card>
        <Card><div className="text-sm text-ht-text-secondary">Total Members</div><div className="mt-1 text-2xl font-bold text-ht-navy">{records.length}</div></Card>
        <Card className="bg-ht-gold-light border-ht-gold/30"><div className="text-sm text-ht-gold font-medium">Membership Revenue</div><div className="mt-1 text-2xl font-bold text-ht-navy">{formatMoney(revenue)}</div></Card>
      </div>

      <Card padded={false} className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl options={['All', 'Tailor', 'Customer']} active={userType} onChange={setUserType} />
          <div className="flex flex-wrap gap-3">
            <div className="w-56"><Input placeholder="Search name" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="w-40"><Select placeholder="All Plans" value={plan} onChange={(e) => setPlan(e.target.value)} options={Array.from(new Set(membershipPlans.map((p) => p.name))).map((n) => ({ label: n, value: n }))} /></div>
            {(search || plan) && <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setPlan(''); }}>Clear</Button>}
          </div>
        </div>
        <DataTable columns={columns} rows={filtered} rowKey={(m) => m.id} emptyTitle="No Memberships Found" />
      </Card>
    </div>
  );
}
