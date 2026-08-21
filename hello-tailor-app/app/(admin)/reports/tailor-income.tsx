import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Tailor } from '@/store/types';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

export default function TailorIncomeReport() {
  const tailors = useStore((s) => s.tailors);
  const totalGross = tailors.reduce((s, t) => s + t.income, 0);
  const totalCommission = tailors.reduce((s, t) => s + t.commissionPaid, 0);

  const sorted = [...tailors].sort((a, b) => b.income - a.income);

  const columns: Column<Tailor>[] = [
    { key: 'shopName', header: 'Tailor', width: 200, sortValue: (t) => t.shopName },
    { key: 'city', header: 'City', width: 110 },
    { key: 'income', header: 'Gross Earnings', width: 130, sortValue: (t) => t.income, render: (t) => <FieldText bold>{inr(t.income)}</FieldText> },
    { key: 'commissionPaid', header: 'Commission Paid', width: 140, sortValue: (t) => t.commissionPaid, render: (t) => <FieldText>{inr(t.commissionPaid)}</FieldText> },
    { key: 'net', header: 'Net Earnings', width: 130, render: (t) => <FieldText bold>{inr(t.income - t.commissionPaid)}</FieldText> },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader title="Tailor Income Report" subtitle="Gross earnings, commission and net earnings by tailor" />
      <View style={styles.statsRow}>
        <Stat label="Total Gross Earnings" value={inr(totalGross)} />
        <Stat label="Total Commission" value={inr(totalCommission)} />
        <Stat label="Total Net Earnings" value={inr(totalGross - totalCommission)} />
      </View>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={sorted} rowKey={(t) => t.id} emptyTitle="No tailor income data" />
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
});
