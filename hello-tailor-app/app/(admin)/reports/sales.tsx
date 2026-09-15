import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BarChart } from '@/components/ui/Chart';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';
import ReportFilterBar from '@/components/admin/ReportFilterBar';
import { inr } from '@/components/admin/analyticsData';
import { defaultRangeFor, isWithinRange, bucketByDay, bucketByMonth, formatYYYYMMDD, type DateRange } from '@/lib/dateRanges';
import { exportCsv } from '@/services/csvExport';
import type { Booking } from '@/store/types';

export default function SalesReport() {
  const bookings = useStore((s) => s.bookings);
  const commissions = useStore((s) => s.commissions);
  const commissionRate = useStore((s) => s.commissionRate);
  const [range, setRange] = useState<DateRange>(() => defaultRangeFor('Monthly'));

  const filtered = useMemo(
    () => bookings.filter((b) => isWithinRange(b.requestedAt, range)),
    [bookings, range],
  );

  const totalRevenue = filtered.reduce((s, b) => s + b.amount, 0);
  const cancelled = filtered.filter((b) => b.status === 'Cancelled' || b.status === 'Rejected').length;
  const completed = filtered.filter((b) => b.status === 'Delivered').length;
  const aov = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;

  // Daily bar for a ~month-or-shorter window, monthly bars for anything longer — keeps the chart
  // legible whether the admin picked "Today" or "This Year".
  const spanDays = (range.to.getTime() - range.from.getTime()) / 86_400_000;
  const chartData = useMemo(
    () =>
      spanDays <= 35
        ? bucketByDay(range, filtered, (b) => b.requestedAt, (b) => b.amount)
        : bucketByMonth(range, filtered, (b) => b.requestedAt, (b) => b.amount),
    [range, filtered, spanDays],
  );

  const commissionByBooking = useMemo(() => {
    const map = new Map<string, number>();
    commissions.forEach((c) => map.set(c.bookingId, c.commissionAmount));
    return map;
  }, [commissions]);

  function paymentStatus(b: Booking) {
    if (b.balancePaid) return 'Paid';
    if (b.advancePaid) return 'Partial';
    return 'Pending';
  }
  function commissionFor(b: Booking) {
    return commissionByBooking.get(b.id) ?? Math.round(b.amount * (commissionRate / 100));
  }

  const columns: Column<Booking>[] = [
    { key: 'id', header: 'Order ID', width: 100 },
    { key: 'customerName', header: 'Customer', width: 140 },
    { key: 'tailorName', header: 'Tailor', width: 160 },
    { key: 'status', header: 'Status', width: 110, render: (b) => <FieldText>{b.status}</FieldText> },
    { key: 'amount', header: 'Amount', width: 100, sortValue: (b) => b.amount, render: (b) => <FieldText bold>{inr(b.amount)}</FieldText> },
    { key: 'payment', header: 'Payment', width: 100, render: (b) => <FieldText>{paymentStatus(b)}</FieldText> },
  ];

  const handleExport = () => {
    exportCsv(
      `hello-tailor-sales-report-${formatYYYYMMDD(range.from)}-to-${formatYYYYMMDD(range.to)}.csv`,
      [
        { header: 'Date', value: (b: Booking) => new Date(b.requestedAt).toLocaleDateString('en-IN') },
        { header: 'Order ID', value: (b: Booking) => b.id },
        { header: 'Customer', value: (b: Booking) => b.customerName },
        { header: 'Tailor', value: (b: Booking) => b.tailorName },
        { header: 'Order Status', value: (b: Booking) => b.status },
        { header: 'Amount', value: (b: Booking) => b.amount },
        { header: 'Commission', value: (b: Booking) => commissionFor(b) },
        { header: 'Payment Status', value: (b: Booking) => paymentStatus(b) },
      ],
      filtered,
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader
        title="Sales Report"
        subtitle="Orders, revenue and average order value for the selected period"
        right={<Button label="Export CSV" variant="outline" onPress={handleExport} style={styles.exportBtn} />}
      />

      <ReportFilterBar range={range} onApply={setRange} />

      <View style={styles.statsRow}>
        <Stat label="Total Orders" value={filtered.length.toLocaleString('en-IN')} />
        <Stat label="Completed" value={completed.toLocaleString('en-IN')} tone="success" />
        <Stat label="Cancelled" value={cancelled.toLocaleString('en-IN')} tone="error" />
        <Stat label="Total Revenue" value={inr(totalRevenue)} tone="gold" />
        <Stat label="Average Order Value" value={inr(aov)} />
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Revenue Trend</Text>
        <BarChart data={chartData} height={180} />
      </Card>

      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(b) => b.id} emptyTitle="No orders in this period" emptyDescription="Try a wider date range." />
      </Card>
    </ScrollView>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'error' | 'gold' }) {
  const color = tone === 'success' ? colors.success : tone === 'error' ? colors.error : tone === 'gold' ? colors.gold : colors.navy;
  return (
    <Card style={{ flex: 1, minWidth: 150 }}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  exportBtn: { minWidth: 130, minHeight: 40 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  statValue: { fontFamily: font.bold, fontSize: 19, color: colors.navy },
  statLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
});
