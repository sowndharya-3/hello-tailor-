import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StepProgress } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

export default function DeliveryDate() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const tailors = useStore((s) => s.tailors);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];

  const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : new Date();
  const estimated = new Date(bookingDate);
  estimated.setDate(estimated.getDate() + tailor.deliveryDays);
  const estimatedStr = estimated.toDateString();

  const submit = () => {
    updateBooking({ deliveryDate: estimatedStr });
    router.push(`/booking/${tailorId}/method` as any);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Delivery Date" subtitle="Auto-estimated based on tailor workload" />
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <StepProgress step={7} total={11} label="Delivery Date" />
      </View>
      <View style={{ padding: spacing.screenH }}>
        <View style={styles.card}>
          <Ionicons name="cube-outline" size={30} color={colors.secondary} />
          <Text style={styles.estLabel}>Estimated Delivery</Text>
          <Text style={styles.estDate}>{estimatedStr}</Text>
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>Why this date?</Text>
          <View style={styles.reasonRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.reasonText}>{tailor.shopName} typically delivers {booking.category} orders in {tailor.deliveryDays} days</Text>
          </View>
          <View style={styles.reasonRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.reasonText}>Booking date: {booking.bookingDate}</Text>
          </View>
          <View style={styles.reasonRow}>
            <Ionicons name="information-circle-outline" size={16} color={colors.secondary} />
            <Text style={styles.reasonText}>Dates earlier than the estimate aren't possible — the tailor needs this much time to stitch and quality-check your order.</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button label="Continue" onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  footer: { paddingHorizontal: spacing.screenH, paddingTop: spacing.md, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  card: { alignItems: 'center', backgroundColor: colors.infoBg, borderRadius: radius.card, padding: spacing.xl, gap: 6 },
  estLabel: { ...type.supporting, color: colors.textSecondary, marginTop: 6 },
  estDate: { ...type.pageTitle, fontSize: 22, color: colors.primary },
  reasonBox: { marginTop: spacing.lg, gap: 10 },
  reasonTitle: { ...type.sectionHeading, fontSize: 16, color: colors.text, marginBottom: 4 },
  reasonRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  reasonText: { ...type.body, color: colors.textSecondary, flex: 1 },
});
