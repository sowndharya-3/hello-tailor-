// Ported from customer-app/app/order/[id]/balance-payment.tsx.
// ponytail: no store mutator for this demo-only payment flow — "paid" is local component state,
// not a global `payBalance` action. Add a real store action when a payment gateway lands.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

export default function BalancePayment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!booking) {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title="Pay Balance" />
        <ErrorState icon="alert-circle-outline" title="Order Not Found" message="We couldn't find this order." />
      </View>
    );
  }

  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;

  const pay = () => {
    setState('processing');
    setTimeout(() => setState('success'), 1400);
  };

  if (state === 'success') {
    return (
      <View style={styles.centerWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        <Text style={styles.successTitle}>Payment Successful</Text>
        <Text style={styles.successSub}>₹{balanceDue} balance paid for order {booking.id}</Text>
        <Button label="View Invoice" style={{ marginTop: spacing.lg, width: '100%' }} onPress={() => router.replace(`/order/${booking.id}/invoice` as any)} />
      </View>
    );
  }

  if (state === 'processing') {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.successTitle}>Processing Payment</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Pay Balance" subtitle={booking.id} />
      <View style={{ padding: spacing.screenH }}>
        <View style={styles.card}>
          <Row label="Total Order Value" value={`₹${booking.amount}`} />
          <Row label="Advance Paid" value={`-₹${booking.advanceAmount}`} muted />
          <Row label="Discount" value={booking.discount ? `-₹${booking.discount}` : '₹0'} muted />
          <Row label="Tax (GST)" value={`₹${booking.tax}`} muted />
          <View style={styles.divider} />
          <Row label="Balance Due" value={`₹${balanceDue}`} bold />
        </View>
        <Button label={`Pay ₹${balanceDue}`} onPress={pay} style={{ marginTop: spacing.lg }} />
      </View>
    </View>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, muted && { color: colors.textSecondary }, bold && { fontFamily: 'Inter_600SemiBold', color: colors.text }]}>{label}</Text>
      <Text style={[styles.rowValue, muted && { color: colors.textSecondary }, bold && { fontFamily: 'Inter_700Bold', color: colors.primary, fontSize: 18 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  centerWrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.section },
  successTitle: { ...type.sectionHeading, color: colors.text, marginTop: spacing.lg },
  successSub: { ...type.body, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { ...type.body, color: colors.text },
  rowValue: { ...type.body, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
});
