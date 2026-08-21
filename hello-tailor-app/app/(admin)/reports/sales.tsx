import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import { BarChart } from '@/components/ui/Chart';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';
import { revenueTrend, orderTrend, inr } from '@/components/admin/analyticsData';

type MonthRow = { month: string; orders: number; revenue: number; aov: number };

export default function SalesReport() {
  const bookings = useStore((s) => s.bookings);
  const totalRevenue = bookings.reduce((s, b) => s + b.amount, 0);
  const aov = bookings.length ? Math.round(totalRevenue / bookings.length) : 0;

  const rows: MonthRow[] = revenueTrend.map((r, i) => ({
    month: r.label,
    revenue: r.value,
    orders: orderTrend[i].value,
    aov: Math.round(r.value / orderTrend[i].value),
  }));

  const columns: Column<MonthRow>[] = [
    { key: 'month', header: 'Month', width: 90 },
    { key: 'orders', header: 'Bookings', width: 100, render: (r) => <FieldText>{r.orders.toLocaleString('en-IN')}</FieldText> },
    { key: 'revenue', header: 'Revenue', width: 120, render: (r) => <FieldText bold>{inr(r.revenue)}</FieldText> },
    { key: 'aov', header: 'AOV', width: 100, render: (r) => <FieldText>{inr(r.aov)}</FieldText> },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader title="Sales Report" subtitle="Booking count and average order value by month" />

      <View style={styles.statsRow}>
        <Stat label="Total Orders" value={bookings.length.toLocaleString('en-IN')} />
        <Stat label="Total Revenue" value={inr(totalRevenue)} />
        <Stat label="Average Order Value" value={inr(aov)} />
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Monthly Revenue</Text>
        <BarChart data={revenueTrend} height={180} />
      </Card>

      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.month} emptyTitle="No data" />
      </Card>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  statValue: { fontFamily: font.bold, fontSize: 19, color: colors.navy },
  statLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
});
