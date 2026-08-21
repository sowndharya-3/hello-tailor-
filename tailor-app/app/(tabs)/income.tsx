import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ScreenHeader, SegmentedControl } from '@/components/ui/Misc';
import { BarChart } from '@/components/ui/Chart';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

const PERIODS = ['Today', 'This Week', 'This Month', 'Custom'];

const WEEK_DATA = [
  { label: 'Mon', value: 1200 }, { label: 'Tue', value: 1800 }, { label: 'Wed', value: 900 },
  { label: 'Thu', value: 2400 }, { label: 'Fri', value: 1600 }, { label: 'Sat', value: 3100 }, { label: 'Sun', value: 2000 },
];
const MONTH_DATA = [
  { label: 'W1', value: 8200 }, { label: 'W2', value: 10400 }, { label: 'W3', value: 7600 }, { label: 'W4', value: 12100 },
];

export default function Income() {
  const orders = useStore((s) => s.orders);
  const [period, setPeriod] = useState('This Week');
  const completed = orders.filter((o) => o.status === 'Completed');

  const stats = useMemo(() => {
    const gross = completed.reduce((sum, o) => sum + o.amount, 0);
    const commissionRate = 0.1;
    const commission = Math.round(gross * commissionRate);
    return { bookings: completed.length, gross, commission, net: gross - commission };
  }, [completed]);

  const chartData = period === 'This Month' ? MONTH_DATA : WEEK_DATA;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Income Report" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <SegmentedControl options={PERIODS} value={period} onChange={setPeriod} />

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.netLabel}>Net Income ({period})</Text>
          <Text style={styles.netAmount}>₹{stats.net.toLocaleString('en-IN')}</Text>
          <View style={styles.statsRow}>
            <Stat label="Total Bookings" value={String(stats.bookings)} />
            <Stat label="Gross Amount" value={`₹${stats.gross.toLocaleString('en-IN')}`} />
            <Stat label="Commission (10%)" value={`₹${stats.commission.toLocaleString('en-IN')}`} />
          </View>
        </Card>

        <Text style={styles.sectionHeading}>{period === 'This Month' ? 'Weekly Breakdown' : 'Daily Breakdown'}</Text>
        <Card>
          <View style={{ alignItems: 'center' }}>
            <BarChart data={chartData} />
          </View>
        </Card>

        <Text style={styles.sectionHeading}>Recent Payouts</Text>
        {completed.slice(0, 6).map((o) => (
          <Card key={o.id} style={{ marginBottom: spacing.sm }}>
            <View style={styles.payoutRow}>
              <View>
                <Text style={styles.payoutName}>{o.customerName}</Text>
                <Text style={styles.payoutSub}>{o.category} · {o.id}</Text>
              </View>
              <Text style={styles.payoutAmount}>+₹{o.amount.toLocaleString('en-IN')}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 32 },
  netLabel: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary },
  netAmount: { fontFamily: font.bold, fontSize: 28, color: colors.textPrimary, marginTop: 4, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  statValue: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary },
  statLabel: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  sectionHeading: { fontFamily: font.semibold, fontSize: 17, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payoutName: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  payoutSub: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  payoutAmount: { fontFamily: font.semibold, fontSize: 14, color: colors.success },
});
