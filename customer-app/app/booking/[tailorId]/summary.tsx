import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { tailors, familyMembers } from '../../../mocks/data';
import { computePricing } from '../../../mocks/pricing';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.secondary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function Summary() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, measurements } = useApp();
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const personName = booking.personId === 'self' ? 'Myself' : familyMembers.find((f) => f.id === booking.personId)?.name ?? '—';
  const measurement = measurements.find((m) => m.id === booking.measurementId);
  const pricing = computePricing(booking);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Booking Summary" subtitle="Review before you pay" />
      <BookingProgress step="summary" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 24 }}>
        <View style={styles.tailorCard}>
          <Image source={{ uri: tailor.image }} style={styles.tailorImg} />
          <View>
            <Text style={styles.tailorName}>{tailor.shopName}</Text>
            <Text style={styles.tailorSub}>{tailor.name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Row icon="shirt-outline" label="Garment" value={`${booking.category} • ${booking.clothType}, ${booking.colour} × ${booking.quantity}`} />
          <Row icon="person-outline" label="For" value={personName} />
          <Row icon="body-outline" label="Measurement" value={measurement?.label ?? 'Not selected'} />
          <Row icon="images-outline" label="Design Photos" value={`${booking.designPhotos?.length ?? 0} photo(s) attached`} />
          <Row icon="calendar-outline" label="Booking Date" value={booking.bookingDate ?? '—'} />
          <Row icon="cube-outline" label="Estimated Delivery" value={booking.deliveryDate ?? '—'} />
          <Row icon="bicycle-outline" label="Pickup / Delivery" value={`${booking.method} • ${booking.timeSlot}`} />
          {booking.notes ? <Row icon="chatbox-ellipses-outline" label="Notes" value={booking.notes} /> : null}
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Details</Text>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Order Amount</Text><Text style={styles.priceValue}>₹{pricing.orderAmount}</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery Fee</Text><Text style={styles.priceValue}>{pricing.deliveryFee ? `₹${pricing.deliveryFee}` : 'Free'}</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Tax (5%)</Text><Text style={styles.priceValue}>₹{pricing.tax}</Text></View>
          <View style={[styles.priceRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 4 }]}>
            <Text style={styles.totalLabel}>Total Payable</Text><Text style={styles.totalValue}>₹{pricing.total}</Text>
          </View>
          <View style={styles.advanceBox}>
            <Text style={styles.advanceText}>Pay ₹{pricing.advance} now (advance) · ₹{pricing.balance} on delivery</Text>
          </View>
        </View>
      </ScrollView>
      <StepFooter label="Proceed to Payment" onPress={() => router.push(`/booking/${tailorId}/payment`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  tailorCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.lg },
  tailorImg: { width: 48, height: 48, borderRadius: 10 },
  tailorName: { ...type.cardTitle, fontSize: 15, color: colors.text },
  tailorSub: { ...type.supporting, color: colors.textSecondary },
  section: { gap: 14, marginBottom: spacing.lg },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  rowLabel: { ...type.supporting, color: colors.textSecondary },
  rowValue: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginTop: 2 },
  priceCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  priceTitle: { ...type.sectionHeading, fontSize: 16, color: colors.text, marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  priceLabel: { ...type.body, color: colors.textSecondary },
  priceValue: { ...type.body, color: colors.text },
  totalLabel: { ...type.cardTitle, fontSize: 15, color: colors.text },
  totalValue: { ...type.cardTitle, fontSize: 15, color: colors.primary },
  advanceBox: { backgroundColor: colors.goldLightBg, borderRadius: radius.input, padding: 10, marginTop: 10 },
  advanceText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.gold, textAlign: 'center' },
});
