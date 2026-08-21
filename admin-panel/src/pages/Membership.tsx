import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import SegmentedControl from '../components/ui/SegmentedControl';
import { membershipRecords, membershipPlans } from '../data/mockData';
import type { MembershipRecord } from '../types';

export default function Membership() {
  const [userType, setUserType] = useState('All');
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');

  const filtered = useMemo(() => membershipRecords.filter((m) =>
    (userType === 'All' || m.userType === userType) &&
    (!search || m.userName.toLowerCase().includes(search.toLowerCase())) &&
    (!plan || m.plan === plan)
  ), [userType, search, plan]);

  const active = membershipRecords.filter((m) => m.status === 'Active').length;
  const revenue = membershipRecords.reduce((s, m) => s + m.amountPaid, 0);

  const columns: Column<MembershipRecord>[] = [
    { key: 'id', header: 'Membership ID' },
    { key: 'userType', header: 'Type' },
    { key: 'userName', header: 'Name' },
    { key: 'plan', header: 'Plan', render: (m) => <span className="rounded-full bg-gold-light px-2.5 py-1 text-xs font-semibold text-gold">{m.plan}</span> },
    { key: 'startDate', header: 'Start Date', sortValue: (m) => m.startDate },
    { key: 'endDate', header: 'End Date', sortValue: (m) => m.endDate },
    { key: 'amountPaid', header: 'Amount Paid', sortValue: (m) => m.amountPaid, render: (m) => `₹${m.amountPaid.toLocaleString('en-IN')}` },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Membership Management" description="Tailor and customer membership overview" />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="text-sm text-text-secondary">Active Memberships</div><div className="mt-1 text-2xl font-bold text-navy">{active}</div></Card>
        <Card><div className="text-sm text-text-secondary">Total Members</div><div className="mt-1 text-2xl font-bold text-navy">{membershipRecords.length}</div></Card>
        <Card className="bg-gold-light border-gold/30"><div className="text-sm text-gold font-medium">Membership Revenue</div><div className="mt-1 text-2xl font-bold text-navy">₹{revenue.toLocaleString('en-IN')}</div></Card>
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
