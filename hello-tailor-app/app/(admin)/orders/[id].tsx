import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { StatusStepper } from '@/components/tailor/StatusStepper';
import { CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard } from '@/components/tailor/OrderDetailShared';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));

  if (!order) return <EmptyState icon="bag-outline" title="Order not found" message="This order record does not exist." />;

  const cancelled = order.status === 'Cancelled' || order.status === 'Rejected';

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <ScreenHeader title={order.id} subtitle={`${order.category} · ${order.tailorName}`} />

      {cancelled ? (
        <Card style={{ borderColor: colors.error, backgroundColor: '#FDEEEC' }}>
          <Badge label={order.status} tone="error" />
          <Text style={styles.cancelText}>{order.status === 'Rejected' ? order.rejectReason : order.cancelReason}</Text>
        </Card>
      ) : (
        <Card>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <StatusStepper current={order.status} />
        </Card>
      )}

      <CustomerInfoCard order={order} />
      <CustomerNotesCard notes={order.notes} />
      <FinancialSummaryCard order={order} />

      <Card>
        <Text style={styles.sectionTitle}>Tailor</Text>
        <Text style={styles.rowTitle}>{order.tailorName}</Text>
        <Text style={styles.rowSub}>Payment: {order.paymentMethod} · Discount {order.discount ? `₹${order.discount}` : '—'} · Tax ₹{order.tax}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.md },
  cancelText: { fontFamily: font.regular, fontSize: 13, color: colors.text, marginTop: 8 },
  rowTitle: { fontFamily: font.medium, fontSize: 14, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
