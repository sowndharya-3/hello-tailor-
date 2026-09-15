import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';
import ReportFilterBar from '@/components/admin/ReportFilterBar';
import { inr } from '@/components/admin/analyticsData';
import { defaultRangeFor, isWithinRange, formatYYYYMMDD, type DateRange } from '@/lib/dateRanges';
import { exportCsv } from '@/services/csvExport';

interface TailorIncomeRow {
  tailorId: string;
  shopName: string;
  city: string;
  orders: number;
  gross: number;
  commission: number;
}

export default function TailorIncomeReport() {
  const tailors = useStore((s) => s.tailors);
  const bookings = useStore((s) => s.bookings);
  const commissionRate = useStore((s) => s.commissionRate);
  const [range, setRange] = useState<DateRange>(() => defaultRangeFor('Monthly'));

  const filteredBookings = useMemo(
    () => bookings.filter((b) => isWithinRange(b.requestedAt, range)),
    [bookings, range],
  );

  // Real period-scoped earnings per tailor — this is what makes the filter actually change what's
  // on screen, as opposed to always showing each Tailor record's all-time cumulative `income`.
  const rows: TailorIncomeRow[] = useMemo(() => {
    return tailors
      .map((t) => {
        const theirBookings = filteredBookings.filter((b) => b.tailorId === t.id);
        const gross = theirBookings.reduce((s, b) => s + b.amount, 0);
        const commission = Math.round(gross * (commissionRate / 100));
        return { tailorId: t.id, shopName: t.shopName, city: t.city, orders: theirBookings.length, gross, commission };
      })
      .filter((r) => r.orders > 0)
      .sort((a, b) => b.gross - a.gross);
  }, [tailors, filteredBookings, commissionRate]);

  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);

  const columns: Column<TailorIncomeRow>[] = [
    { key: 'shopName', header: 'Tailor', width: 200, sortValue: (r) => r.shopName },
    { key: 'city', header: 'City', width: 110 },
    { key: 'orders', header: 'Orders', width: 90, sortValue: (r) => r.orders },
    { key: 'gross', header: 'Gross Earnings', width: 130, sortValue: (r) => r.gross, render: (r) => <FieldText bold>{inr(r.gross)}</FieldText> },
    { key: 'commission', header: 'Commission', width: 130, sortValue: (r) => r.commission, render: (r) => <FieldText>{inr(r.commission)}</FieldText> },
    { key: 'net', header: 'Net Earnings', width: 130, render: (r) => <FieldText bold>{inr(r.gross - r.commission)}</FieldText> },
  ];

  const handleExport = () => {
    exportCsv(
      `hello-tailor-tailor-income-${formatYYYYMMDD(range.from)}-to-${formatYYYYMMDD(range.to)}.csv`,
      [
        { header: 'Tailor', value: (r: TailorIncomeRow) => r.shopName },
        { header: 'City', value: (r: TailorIncomeRow) => r.city },
        { header: 'Orders', value: (r: TailorIncomeRow) => r.orders },
        { header: 'Gross Earnings', value: (r: TailorIncomeRow) => r.gross },
        { header: 'Commission', value: (r: TailorIncomeRow) => r.commission },
        { header: 'Net Earnings', value: (r: TailorIncomeRow) => r.gross - r.commission },
      ],
      rows,
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader
        title="Tailor Income Report"
        subtitle="Gross earnings, commission and net earnings by tailor"
        right={<Button label="Export CSV" variant="outline" onPress={handleExport} style={styles.exportBtn} />}
      />

      <ReportFilterBar range={range} onApply={setRange} />

      <View style={styles.statsRow}>
        <Stat label="Total Gross Earnings" value={inr(totalGross)} />
        <Stat label="Total Commission" value={inr(totalCommission)} tone="gold" />
        <Stat label="Total Net Earnings" value={inr(totalGross - totalCommission)} tone="success" />
      </View>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.tailorId} emptyTitle="No tailor income in this period" emptyDescription="Try a wider date range." />
      </Card>
    </ScrollView>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'gold' }) {
  const color = tone === 'success' ? colors.success : tone === 'gold' ? colors.gold : colors.navy;
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
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
});
