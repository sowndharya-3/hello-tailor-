import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/admin/PageHeader';
import StatCard, { StatGrid } from '@/components/admin/StatCard';
import Card from '@/components/ui/Card';
import { LineChart } from '@/components/ui/Chart';
import { customerGrowth, tailorGrowth, orderTrend, cancelledTrend, topCategories, topCities } from '@/components/admin/analyticsData';

export default function Analytics() {
  const tailors = useStore((s) => s.tailors);
  const activeTailors = tailors.filter((t) => t.status === 'Active').length;

  const completed = orderTrend.reduce((s, o) => s + o.value, 0) - cancelledTrend.reduce((s, c) => s + c.value, 0);
  const cancelled = cancelledTrend.reduce((s, c) => s + c.value, 0);
  const completionPct = Math.round((completed / (completed + cancelled)) * 100);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Analytics" description="Marketplace health, growth and engagement metrics" />

      <StatGrid>
        <StatCard label="Registrations (30d)" value="2,140" icon="person-add-outline" trend={14.2} />
        <StatCard label="Active Customers" value="9,860" icon="people-outline" trend={5.6} />
        <StatCard label="Active Tailors" value={activeTailors.toLocaleString('en-IN')} icon="checkmark-circle-outline" trend={3.1} />
        <StatCard label="Bookings (30d)" value="6,420" icon="bag-handle-outline" trend={9.4} />
        <StatCard label="Conversion Rate" value="4.8%" icon="trending-up-outline" trend={1.2} />
        <StatCard label="Revenue (30d)" value="₹18.4L" icon="cash-outline" trend={7.9} gold />
        <StatCard label="Commission (30d)" value="₹2.2L" icon="pricetag-outline" trend={6.3} />
        <StatCard label="Membership Growth" value="+340" icon="medal-outline" trend={22.1} gold />
        <StatCard label="Ad Impressions" value="1.2M" icon="megaphone-outline" trend={-3.4} />
        <StatCard label="Repeat Order Rate" value="38.6%" icon="repeat-outline" trend={2.8} />
      </StatGrid>

      <View style={styles.chartGrid}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Customer Growth</Text>
          <LineChart data={customerGrowth.map((d) => d.value)} width={320} height={160} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tailor Growth</Text>
          <LineChart data={tailorGrowth.map((d) => d.value)} width={320} height={160} />
        </Card>
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.chartTitle}>Order Completion vs Cancellation</Text>
        <View style={styles.completionRow}>
          <View style={styles.donut}>
            <Text style={styles.donutPct}>{completionPct}%</Text>
            <Text style={styles.donutLabel}>Completed</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>{completed.toLocaleString('en-IN')} Completed</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>{cancelled.toLocaleString('en-IN')} Cancelled</Text>
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.chartGrid}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Performing Categories</Text>
          {topCategories.map((c) => <Bar key={c.name} name={c.name} value={c.orders} max={topCategories[0].orders} tone={colors.ocean} />)}
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Performing Locations</Text>
          {topCities.map((c) => <Bar key={c.name} name={c.name} value={c.orders} max={topCities[0].orders} tone={colors.gold} />)}
        </Card>
      </View>
    </ScrollView>
  );
}

function Bar({ name, value, max, tone }: { name: string; value: number; max: number; tone: string }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={styles.barName}>{name}</Text>
        <Text style={styles.barValue}>{value.toLocaleString('en-IN')}</Text>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${(value / max) * 100}%`, backgroundColor: tone }]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  chartCard: { flexGrow: 1, minWidth: 320 },
  chartTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
  completionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, flexWrap: 'wrap' },
  donut: { width: 100, height: 100, borderRadius: 50, borderWidth: 10, borderColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  donutPct: { fontFamily: font.bold, fontSize: 18, color: colors.text },
  donutLabel: { fontFamily: font.regular, fontSize: 10, color: colors.textSecondary },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  barName: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  barValue: { fontFamily: font.semibold, fontSize: 12, color: colors.navy },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
});
