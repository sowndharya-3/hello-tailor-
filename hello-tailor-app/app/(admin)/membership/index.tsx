import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Tailor, Customer } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import StatCard, { StatGrid } from '@/components/admin/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const TIERS = ['Silver', 'Gold', 'Premium', 'Diamond'] as const;

export default function MembershipOverview() {
  const tailors = useStore((s) => s.tailors);
  const customers = useStore((s) => s.customers);

  const tailorPaid = tailors.filter((t) => t.membership !== 'None').length;
  const customerPaid = customers.filter((c) => c.membership !== 'None').length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Membership Management" description="Overview of active memberships across tailors and customers" />

      <StatGrid>
        <StatCard label="Paid Tailors" value={tailorPaid.toString()} icon="cut-outline" />
        <StatCard label="Paid Customers" value={customerPaid.toString()} icon="people-outline" />
        <StatCard label="Total Members" value={(tailorPaid + customerPaid).toString()} icon="medal-outline" gold />
      </StatGrid>

      <View style={styles.grid}>
        <MemberBreakdown title="Tailor Memberships" items={tailors} />
        <MemberBreakdown title="Customer Memberships" items={customers} />
      </View>
    </ScrollView>
  );
}

function MemberBreakdown({ title, items }: { title: string; items: (Tailor | Customer)[] }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {TIERS.map((tier) => {
        const count = items.filter((i) => i.membership === tier).length;
        return (
          <View key={tier} style={styles.row}>
            <Badge label={tier} tone="gold" />
            <Text style={styles.count}>{count}</Text>
          </View>
        );
      })}
      <View style={styles.row}>
        <Badge label="None" tone="neutral" />
        <Text style={styles.count}>{items.filter((i) => i.membership === 'None').length}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  card: { flexGrow: 1, minWidth: 300 },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.border },
  count: { fontFamily: font.bold, fontSize: 15, color: colors.text },
});
