import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import Button from '../../../components/ui/Button';
import { useApp } from '../../../store/AppState';

export default function BookingSuccess() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, resetBooking } = useApp();
  const orderId = `HT-20260821-${Math.floor(1000 + Math.random() * 8999)}`;

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
      </View>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.sub}>Your order has been placed successfully. {booking.category} order for {booking.bookingDate} is on its way.</Text>

      <View style={styles.card}>
        <Text style={styles.orderLabel}>Order ID</Text>
        <Text style={styles.orderId}>{orderId}</Text>
      </View>

      <Button
        label="Track Order"
        onPress={() => {
          resetBooking();
          router.replace('/order/HT-20260812-1041');
        }}
        style={{ marginTop: spacing.lg, width: '100%' }}
      />
      <Button
        label="Back to Home"
        variant="outline"
        onPress={() => {
          resetBooking();
          router.replace('/(tabs)');
        }}
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
