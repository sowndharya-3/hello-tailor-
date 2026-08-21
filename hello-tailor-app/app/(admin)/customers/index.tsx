import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Customer } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';

export default function CustomersList() {
  const customers = useStore((s) => s.customers);
  const updateCustomerStatus = useStore((s) => s.updateCustomerStatus);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [confirmFor, setConfirmFor] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (status !== 'All' && c.status !== status) return false;
      if (search && !`${c.name} ${c.mobile} ${c.email} ${c.city}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [customers, search, status]);

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Customer', width: 200, sortValue: (c) => c.name, render: (c) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Avatar uri={c.avatar} name={c.name} size={30} />
        <View><FieldText bold>{c.name}</FieldText><FieldText muted>{c.id}</FieldText></View>
      </View>
    ) },
    { key: 'mobile', header: 'Mobile', width: 130, sortValue: (c) => c.mobile },
    { key: 'city', header: 'City', width: 120, sortValue: (c) => c.city },
    { key: 'joinedDate', header: 'Joined', width: 110, sortValue: (c) => c.joinedDate, render: (c) => <FieldText>{new Date(c.joinedDate).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'ordersCount', header: 'Orders', width: 80, sortValue: (c) => c.ordersCount },
    { key: 'membership', header: 'Membership', width: 110, render: (c) => c.membership === 'None' ? <FieldText muted>None</FieldText> : <Badge label={c.membership} tone="gold" /> },
    { key: 'status', header: 'Status', width: 100, render: (c) => <Badge label={c.status} tone={STATUS_TONE[c.status]} /> },
  ];

  const actions: RowAction<Customer>[] = [
    { label: 'View Details', onPress: (c) => router.push(`/(admin)/customers/${c.id}` as any) },
    { label: 'Block Customer', hidden: (c) => c.status === 'Blocked', onPress: (c) => setConfirmFor(c), destructive: true },
    { label: 'Unblock Customer', hidden: (c) => c.status !== 'Blocked', onPress: (c) => setConfirmFor(c) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Customer Management" description={`${customers.length} registered customers`} />
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.filters}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Input placeholder="Search by name, mobile, email, city" value={search} onChangeText={setSearch} optional />
          </View>
          <View style={{ minWidth: 320 }}>
            <SegmentedControl options={['All', 'Active', 'Blocked', 'Pending']} value={status} onChange={setStatus} />
          </View>
        </View>
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(c) => c.id} actions={actions} onRowPress={(c) => router.push(`/(admin)/customers/${c.id}` as any)} emptyTitle="No customers found" />
      </Card>

      <ConfirmDialog
        visible={!!confirmFor}
        title={confirmFor?.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
        message={`Are you sure you want to ${confirmFor?.status === 'Blocked' ? 'unblock' : 'block'} ${confirmFor?.name}?`}
        confirmLabel={confirmFor?.status === 'Blocked' ? 'Unblock' : 'Block'}
        destructive={confirmFor?.status !== 'Blocked'}
        onCancel={() => setConfirmFor(null)}
        onConfirm={() => { if (confirmFor) updateCustomerStatus(confirmFor.id, confirmFor.status === 'Blocked' ? 'Active' : 'Blocked'); setConfirmFor(null); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
});
