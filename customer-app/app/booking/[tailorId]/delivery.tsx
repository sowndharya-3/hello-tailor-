import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { tailors } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

export default function DeliveryDate() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, updateBooking } = useApp();
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];

  const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : new Date();
  const estimated = new Date(bookingDate);
  estimated.setDate(estimated.getDate() + tailor.deliveryDays);
  const estimatedStr = estimated.toDateString();

  const submit = () => {
    updateBooking({ deliveryDate: estimatedStr });
    router.push(`/booking/${tailorId}/method`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Delivery Date" subtitle="Auto-estimated based on tailor workload" />
      <BookingProgress step="delivery" />
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
      <StepFooter label="Continue" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { alignItems: 'center', backgroundColor: colors.infoBg, borderRadius: radius.card, padding: spacing.xl, gap: 6 },
  estLabel: { ...type.supporting, color: colors.textSecondary, marginTop: 6 },
  estDate: { ...type.pageTitle, fontSize: 22, color: colors.primary },
  reasonBox: { marginTop: spacing.lg, gap: 10 },
  reasonTitle: { ...type.sectionHeading, fontSize: 16, color: colors.text, marginBottom: 4 },
  reasonRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  reasonText: { ...type.body, color: colors.textSecondary, flex: 1 },
});
