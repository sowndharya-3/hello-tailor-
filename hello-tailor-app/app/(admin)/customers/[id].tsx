import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { STATUS_TONE } from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

export default function CustomerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const customer = useStore((s) => s.customers.find((c) => c.id === id));
  const bookings = useStore((s) => s.bookings.filter((b) => b.customerName === customer?.name));
  const payments = useStore((s) => s.payments.filter((p) => p.customerName === customer?.name));
  const updateCustomerStatus = useStore((s) => s.updateCustomerStatus);
  const [confirm, setConfirm] = useState(false);

  if (!customer) return <EmptyState icon="person-outline" title="Customer not found" message="This customer record does not exist." />;

  const blocked = customer.status === 'Blocked';

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader title={customer.name} subtitle={customer.id} />

      <Card style={styles.profileCard}>
        <Avatar uri={customer.avatar} name={customer.name} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.sub}>{customer.mobile} · {customer.email}</Text>
          <Text style={styles.sub}>{customer.city}, {customer.state}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Badge label={customer.status} tone={STATUS_TONE[customer.status]} />
            {customer.membership !== 'None' && <Badge label={`${customer.membership} Member`} tone="gold" />}
          </View>
        </View>
        <Button label={blocked ? 'Unblock' : 'Block'} variant={blocked ? 'primary' : 'destructive'} onPress={() => setConfirm(true)} style={{ minWidth: 120 }} />
      </Card>

      <View style={styles.statsRow}>
        <Stat label="Orders" value={customer.ordersCount.toString()} />
        <Stat label="Total Spend" value={inr(customer.totalSpend)} />
        <Stat label="Joined" value={new Date(customer.joinedDate).toLocaleDateString('en-IN')} />
      </View>

      <Text style={styles.sectionTitle}>Order History</Text>
      <Card noPadding style={{ padding: spacing.md }}>
        {bookings.length === 0 ? (
          <Text style={styles.empty}>No orders yet.</Text>
        ) : bookings.map((b) => (
          <View key={b.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{b.id} · {b.category}</Text>
              <Text style={styles.rowSub}>{b.tailorName} · {new Date(b.bookingDate).toLocaleDateString('en-IN')}</Text>
            </View>
            <Text style={styles.rowAmount}>{inr(b.amount)}</Text>
            <Badge label={b.status} tone={b.status === 'Delivered' ? 'success' : b.status === 'Cancelled' || b.status === 'Rejected' ? 'error' : 'info'} />
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Payment History</Text>
      <Card noPadding style={{ padding: spacing.md, marginBottom: spacing.xl }}>
        {payments.length === 0 ? (
          <Text style={styles.empty}>No payments yet.</Text>
        ) : payments.map((p) => (
          <View key={p.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{p.id} · {p.type}</Text>
              <Text style={styles.rowSub}>{p.method} · {new Date(p.date).toLocaleDateString('en-IN')}</Text>
            </View>
            <Text style={styles.rowAmount}>{inr(p.amount)}</Text>
            <Badge label={p.status} tone={STATUS_TONE[p.status]} />
          </View>
        ))}
      </Card>

      <ConfirmDialog
        visible={confirm}
        title={blocked ? 'Unblock Customer' : 'Block Customer'}
        message={`Are you sure you want to ${blocked ? 'unblock' : 'block'} ${customer.name}?`}
        confirmLabel={blocked ? 'Unblock' : 'Block'}
        destructive={!blocked}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { updateCustomerStatus(customer.id, blocked ? 'Active' : 'Blocked'); setConfirm(false); }}
      />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  name: { fontFamily: font.bold, fontSize: 18, color: colors.text },
  sub: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statValue: { fontFamily: font.bold, fontSize: 18, color: colors.navy },
  statLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.sm, marginTop: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border },
  rowTitle: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  rowAmount: { fontFamily: font.semibold, fontSize: 13, color: colors.navy, marginRight: 8 },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, paddingVertical: 12 },
});
