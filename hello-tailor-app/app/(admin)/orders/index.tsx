import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

const STATUS_FILTERS = ['All', 'Requested', 'Accepted', 'In Progress', 'Ready', 'Delivered', 'Cancelled', 'Rejected'];

function statusTone(status: Booking['status']) {
  if (status === 'Delivered') return 'success' as const;
  if (status === 'Cancelled' || status === 'Rejected') return 'error' as const;
  if (status === 'Requested') return 'warning' as const;
  return 'info' as const;
}

export default function OrdersList() {
  const bookings = useStore((s) => s.bookings);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== 'All' && b.status !== status) return false;
      if (search && !`${b.id} ${b.customerName} ${b.tailorName} ${b.city}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [bookings, search, status]);

  const columns: Column<Booking>[] = [
    { key: 'id', header: 'Order ID', width: 110, sortValue: (b) => b.id },
    { key: 'customerName', header: 'Customer', width: 150, sortValue: (b) => b.customerName },
    { key: 'tailorName', header: 'Tailor', width: 170, sortValue: (b) => b.tailorName },
    { key: 'category', header: 'Category', width: 110 },
    { key: 'city', header: 'City', width: 110 },
    { key: 'bookingDate', header: 'Date', width: 100, sortValue: (b) => b.bookingDate, render: (b) => <FieldText>{new Date(b.bookingDate).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'amount', header: 'Amount', width: 100, sortValue: (b) => b.amount, render: (b) => <FieldText bold>{inr(b.amount)}</FieldText> },
    { key: 'status', header: 'Status', width: 120, render: (b) => <Badge label={b.status} tone={statusTone(b.status)} /> },
  ];

  const actions: RowAction<Booking>[] = [
    { label: 'View Order', onPress: (b) => router.push(`/(admin)/orders/${b.id}` as any) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Order Management" description={`${bookings.length} orders across the marketplace`} />
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.filters}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Input placeholder="Search by order ID, customer, tailor, city" value={search} onChangeText={setSearch} />
          </View>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <SegmentedControl options={STATUS_FILTERS.slice(0, 4)} value={STATUS_FILTERS.slice(0, 4).includes(status) ? status : 'All'} onChange={setStatus} />
        </View>
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(b) => b.id} actions={actions} onRowPress={(b) => router.push(`/(admin)/orders/${b.id}` as any)} emptyTitle="No orders found" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
});
