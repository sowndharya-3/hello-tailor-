import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BarChart } from '@/components/ui/Chart';
import ReportFilterBar from '@/components/admin/ReportFilterBar';
import { incomeBreakdown, inr } from '@/components/admin/analyticsData';
import { defaultRangeFor, isWithinRange, bucketByDay, bucketByMonth, formatYYYYMMDD, type DateRange } from '@/lib/dateRanges';
import { exportCsv } from '@/services/csvExport';

export default function AppIncomeReport() {
  const bookings = useStore((s) => s.bookings);
  const commissionRate = useStore((s) => s.commissionRate);
  const [range, setRange] = useState<DateRange>(() => defaultRangeFor('Monthly'));

  // Booking commission is the one app-income source with real dated records (every Booking has
  // requestedAt + amount), so it's the only line here that genuinely responds to the date filter.
  // Memberships/Advertisements/Featured Listings have no per-transaction date in the current data
  // model (MembershipPlan/Advertisement are catalog definitions, not a dated purchase log) — per
  // the brief's own instruction not to invent business logic the data layer doesn't support,
  // those stay as their all-time totals below, clearly labeled as such rather than pretending
  // they respond to the filter.
  const filteredBookings = useMemo(() => bookings.filter((b) => isWithinRange(b.requestedAt, range)), [bookings, range]);
  const periodCommission = useMemo(
    () => filteredBookings.reduce((sum, b) => sum + Math.round(b.amount * (commissionRate / 100)), 0),
    [filteredBookings, commissionRate],
  );

  const spanDays = (range.to.getTime() - range.from.getTime()) / 86_400_000;
  const chartData = useMemo(
    () =>
      spanDays <= 35
        ? bucketByDay(range, filteredBookings, (b) => b.requestedAt, (b) => Math.round(b.amount * (commissionRate / 100)))
        : bucketByMonth(range, filteredBookings, (b) => b.requestedAt, (b) => Math.round(b.amount * (commissionRate / 100))),
    [range, filteredBookings, spanDays, commissionRate],
  );

  const allTimeOtherSources = incomeBreakdown.filter((i) => i.name !== 'Booking Commission');
  const allTimeTotal = allTimeOtherSources.reduce((s, i) => s + i.value, 0) + periodCommission;
  const max = Math.max(periodCommission, ...allTimeOtherSources.map((i) => i.value));

  const handleExport = () => {
    exportCsv(
      `hello-tailor-app-income-${formatYYYYMMDD(range.from)}-to-${formatYYYYMMDD(range.to)}.csv`,
      [
        { header: 'Period', value: (r: { label: string; value: number }) => r.label },
        { header: 'Booking Commission', value: (r: { label: string; value: number }) => r.value },
      ],
      chartData,
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader
        title="App Income Report"
        subtitle="Platform income by source"
        right={<Button label="Export CSV" variant="outline" onPress={handleExport} style={styles.exportBtn} />}
      />

      <ReportFilterBar range={range} onApply={setRange} />

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.totalLabel}>Booking Commission — Selected Period</Text>
        <Text style={styles.totalValue}>{inr(periodCommission)}</Text>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Commission Trend</Text>
        <BarChart data={chartData} height={160} />
      </Card>

      <Text style={styles.sectionNote}>All-time platform income by source</Text>
      <Text style={styles.sectionSubNote}>
        Memberships, advertisements and featured listings don't yet have a dated transaction log in
        the data layer, so these totals are all-time rather than filtered to the period above.
      </Text>
      <Card>
        <IncomeRow name="Booking Commission (All-Time)" value={incomeBreakdown.find((i) => i.name === 'Booking Commission')?.value ?? 0} max={max} highlight />
        {allTimeOtherSources.map((i) => (
          <IncomeRow key={i.name} name={i.name} value={i.value} max={max} />
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalRowLabel}>Total (period commission + all-time other sources)</Text>
          <Text style={styles.totalRowValue}>{inr(allTimeTotal)}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

function IncomeRow({ name, value, max, highlight }: { name: string; value: number; max: number; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <View style={styles.rowHead}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.value}>{inr(value)}</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${max ? (value / max) * 100 : 0}%`, backgroundColor: highlight ? colors.ocean : colors.gold }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exportBtn: { minWidth: 130, minHeight: 40 },
  totalLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  totalValue: { fontFamily: font.bold, fontSize: 28, color: colors.navy, marginTop: 4 },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
  sectionNote: { fontFamily: font.semibold, fontSize: 14, color: colors.text, marginTop: spacing.sm, marginBottom: 2 },
  sectionSubNote: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 17 },
  row: { marginBottom: spacing.md },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  value: { fontFamily: font.semibold, fontSize: 13, color: colors.navy },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.xs },
  totalRowLabel: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary, flex: 1, marginRight: spacing.sm },
  totalRowValue: { fontFamily: font.bold, fontSize: 16, color: colors.navy },
});
