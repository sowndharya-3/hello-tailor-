import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

export default function BookingSuccess() {
  const { tailorId, id, failed } = useLocalSearchParams<{ tailorId: string; id?: string; failed?: string }>();

  if (failed === '1') {
    return (
      <View style={styles.wrap}>
        <ErrorState
          icon="close-circle-outline"
          title="Payment Failed"
          message="We couldn't process your payment. No amount was deducted. Please try again."
          ctaLabel="Retry Payment"
          onPress={() => router.replace(`/booking/${tailorId}/payment` as any)}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
      </View>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.sub}>Your order has been placed successfully. We'll notify you as soon as the tailor accepts it.</Text>

      <View style={styles.card}>
        <Text style={styles.orderLabel}>Order ID</Text>
        <Text style={styles.orderId}>{id ?? '—'}</Text>
      </View>

      <Button
        label="Track Order"
        onPress={() => router.replace(id ? (`/order/${id}` as any) : ('/(customer)/bookings' as any))}
        style={{ marginTop: spacing.lg, width: '100%' }}
      />
      <Button
        label="Back to Home"
        variant="outline"
        onPress={() => router.replace('/(customer)' as any)}
        style={{ marginTop: spacing.md, width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.section },
  iconWrap: { marginBottom: spacing.lg },
  title: { ...type.pageTitle, color: colors.text, textAlign: 'center' },
  sub: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  card: { marginTop: spacing.xl, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, alignItems: 'center', width: '100%' },
  orderLabel: { ...type.supporting, color: colors.textSecondary },
  orderId: { ...type.cardTitle, color: colors.primary, marginTop: 4 },
});
