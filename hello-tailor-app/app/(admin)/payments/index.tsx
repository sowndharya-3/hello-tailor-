import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Payment } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

export default function PaymentsList() {
  const payments = useStore((s) => s.payments);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (status !== 'All' && p.status !== status) return false;
      if (search && !`${p.id} ${p.bookingId} ${p.customerName} ${p.tailorName}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [payments, search, status]);

  const totalPaid = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);

  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Payment ID', width: 110 },
    { key: 'bookingId', header: 'Order', width: 100 },
    { key: 'customerName', header: 'Customer', width: 140, sortValue: (p) => p.customerName },
    { key: 'tailorName', header: 'Tailor', width: 160, sortValue: (p) => p.tailorName },
    { key: 'type', header: 'Type', width: 100 },
    { key: 'amount', header: 'Amount', width: 100, sortValue: (p) => p.amount, render: (p) => <FieldText bold>{inr(p.amount)}</FieldText> },
    { key: 'method', header: 'Method', width: 100 },
    { key: 'date', header: 'Date', width: 100, sortValue: (p) => p.date, render: (p) => <FieldText>{new Date(p.date).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'status', header: 'Status', width: 100, render: (p) => <Badge label={p.status} tone={STATUS_TONE[p.status]} /> },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Payment Management" description={`Total collected: ${inr(totalPaid)}`} />
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.filters}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Input placeholder="Search by payment ID, order, customer, tailor" value={search} onChangeText={setSearch} />
          </View>
          <View style={{ minWidth: 340 }}>
            <SegmentedControl options={['All', 'Paid', 'Pending', 'Refunded']} value={['All', 'Paid', 'Pending', 'Refunded'].includes(status) ? status : 'All'} onChange={setStatus} />
          </View>
        </View>
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} emptyTitle="No payments found" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
});
