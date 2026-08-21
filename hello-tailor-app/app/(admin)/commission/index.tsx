import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { CommissionEntry } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

export default function CommissionScreen() {
  const commissions = useStore((s) => s.commissions);
  const commissionRate = useStore((s) => s.commissionRate);
  const setCommissionRate = useStore((s) => s.setCommissionRate);
  const [rateInput, setRateInput] = useState(String(commissionRate));
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => commissions.filter((c) => status === 'All' || c.status === status), [commissions, status]);
  const totalCollected = commissions.filter((c) => c.status === 'Collected').reduce((s, c) => s + c.commissionAmount, 0);
  const totalPending = commissions.filter((c) => c.status === 'Pending').reduce((s, c) => s + c.commissionAmount, 0);

  const columns: Column<CommissionEntry>[] = [
    { key: 'id', header: 'ID', width: 100 },
    { key: 'bookingId', header: 'Order', width: 100 },
    { key: 'tailorName', header: 'Tailor', width: 170, sortValue: (c) => c.tailorName },
    { key: 'orderAmount', header: 'Order Amt', width: 100, sortValue: (c) => c.orderAmount, render: (c) => <FieldText>{inr(c.orderAmount)}</FieldText> },
    { key: 'commissionRate', header: 'Rate', width: 70, render: (c) => <FieldText>{c.commissionRate}%</FieldText> },
    { key: 'commissionAmount', header: 'Commission', width: 110, sortValue: (c) => c.commissionAmount, render: (c) => <FieldText bold>{inr(c.commissionAmount)}</FieldText> },
    { key: 'period', header: 'Period', width: 90 },
    { key: 'status', header: 'Status', width: 100, render: (c) => <Badge label={c.status} tone={STATUS_TONE[c.status]} /> },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Commission Management" description="Configure platform commission and track collections" />

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Commission Rate Configuration</Text>
        <View style={styles.rateRow}>
          <View style={{ flex: 1, maxWidth: 160 }}>
            <Input label="Default Rate (%)" keyboardType="numeric" value={rateInput} onChangeText={setRateInput} />
          </View>
          <Button label="Save Rate" onPress={() => setCommissionRate(Number(rateInput) || commissionRate)} style={{ minWidth: 140 }} />
          <Text style={styles.currentRate}>Current: {commissionRate}%</Text>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Stat label="Total Collected" value={inr(totalCollected)} tone={colors.success} />
        <Stat label="Total Pending" value={inr(totalPending)} tone={colors.warning} />
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <SegmentedControl options={['All', 'Collected', 'Pending']} value={status} onChange={setStatus} />
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(c) => c.id} emptyTitle="No commission entries" />
      </Card>
    </ScrollView>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
      <Text style={[styles.statValue, { color: tone }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.sm },
  rateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, flexWrap: 'wrap' },
  currentRate: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary, marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  statValue: { fontFamily: font.bold, fontSize: 20 },
  statLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
