import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/admin/PageHeader';
import StatCard, { StatGrid } from '@/components/admin/StatCard';
import Card from '@/components/ui/Card';
import { BarChart, LineChart } from '@/components/ui/Chart';
import { revenueTrend, orderTrend, customerGrowth, tailorGrowth, topCategories, topCities, inr } from '@/components/admin/analyticsData';

function ProgressRow({ rank, name, orders, max, tone }: { rank: number; name: string; orders: number; max: number; tone: string }) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.rank, { backgroundColor: tone + '1A' }]}>
        <Text style={[rowStyles.rankText, { color: tone }]}>{rank}</Text>
      </View>
      <Text style={rowStyles.name} numberOfLines={1}>{name}</Text>
      <Text style={rowStyles.value}>{orders.toLocaleString('en-IN')} orders</Text>
    </View>
  );
}
const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  rank: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontFamily: font.bold, fontSize: 11 },
  name: { flex: 1, fontFamily: font.medium, fontSize: 13, color: colors.text },
  value: { fontFamily: font.semibold, fontSize: 13, color: colors.navy },
});

export default function Dashboard() {
  const customers = useStore((s) => s.customers);
  const tailors = useStore((s) => s.tailors);
  const bookings = useStore((s) => s.bookings);
  const commissions = useStore((s) => s.commissions);
  const advertisements = useStore((s) => s.advertisements);
  const complaints = useStore((s) => s.complaints);

  const activeTailors = tailors.filter((t) => t.status === 'Active').length;
  const completedOrders = bookings.filter((b) => b.status === 'Delivered').length;
  const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const commission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const membershipIncome = tailors.filter((t) => t.membership !== 'None').length * 999;
  const adIncome = advertisements.filter((a) => a.status === 'Active').length * 799;
  const pendingComplaints = complaints.filter((c) => c.status === 'Open').length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Dashboard" description="Overview of Hello Tailor marketplace performance" />

      <StatGrid>
        <StatCard label="Total Customers" value={customers.length.toLocaleString('en-IN')} icon="people-outline" trend={8.2} />
        <StatCard label="Total Tailors" value={tailors.length.toLocaleString('en-IN')} icon="cut-outline" trend={5.1} />
        <StatCard label="Active Tailors" value={activeTailors.toLocaleString('en-IN')} icon="checkmark-circle-outline" trend={3.4} />
        <StatCard label="Total Orders" value={bookings.length.toLocaleString('en-IN')} icon="bag-handle-outline" trend={12.6} />
        <StatCard label="Completed Orders" value={completedOrders.toLocaleString('en-IN')} icon="checkmark-done-outline" trend={6.7} />
        <StatCard label="Revenue" value={inr(revenue)} icon="cash-outline" trend={9.8} gold />
        <StatCard label="Commission Earned" value={inr(commission)} icon="pricetag-outline" trend={4.3} />
        <StatCard label="Membership Income" value={inr(membershipIncome)} icon="medal-outline" trend={11.2} gold />
        <StatCard label="Advertisement Income" value={inr(adIncome)} icon="megaphone-outline" trend={-2.1} />
        <StatCard label="Pending Complaints" value={pendingComplaints.toString()} icon="warning-outline" />
      </StatGrid>

      <View style={styles.chartGrid}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <LineChart data={revenueTrend.map((d) => d.value)} width={320} height={160} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Order Trend</Text>
          <BarChart data={orderTrend} height={160} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Customer Growth</Text>
          <LineChart data={customerGrowth.map((d) => d.value)} width={320} height={140} />
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tailor Growth</Text>
          <LineChart data={tailorGrowth.map((d) => d.value)} width={320} height={140} />
        </Card>
      </View>

      <View style={styles.chartGrid}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Categories</Text>
          {topCategories.map((c, i) => (
            <ProgressRow key={c.name} rank={i + 1} name={c.name} orders={c.orders} max={topCategories[0].orders} tone={colors.ocean} />
          ))}
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Cities</Text>
          {topCities.map((c, i) => (
            <ProgressRow key={c.name} rank={i + 1} name={c.name} orders={c.orders} max={topCities[0].orders} tone={colors.gold} />
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  chartCard: { flexGrow: 1, minWidth: 320 },
  chartTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
});
