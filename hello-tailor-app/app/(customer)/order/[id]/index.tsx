// Ported from customer-app/app/order/[id]/index.tsx — old app used Order.currentStageIndex
// into a fixed orderStages array. New store instead has Booking.status: BookingStatus and
// Booking.history. Current step = BOOKING_STAGES.indexOf(booking.status); Rejected/Cancelled
// get a distinct terminal state instead of the stepper.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { BOOKING_STAGES } from '@/store/types';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

function timestampFor(historyStage: string, history: { stage: string; at: string }[]) {
  const entry = history.find((h) => h.stage === historyStage);
  if (!entry) return null;
  return new Date(entry.at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));

  if (!booking) {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title="Track Order" />
        <ErrorState icon="alert-circle-outline" title="Order Not Found" message="We couldn't find this order." />
      </View>
    );
  }

  const terminal = booking.status === 'Rejected' || booking.status === 'Cancelled';
  const currentIndex = terminal ? -1 : BOOKING_STAGES.indexOf(booking.status);
  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Track Order" subtitle={booking.id} />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.tailorRow}>
          <Image source={{ uri: tailor?.image }} style={styles.tailorImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tailorName}>{tailor?.shopName ?? booking.tailorName}</Text>
            <Text style={styles.tailorSub}>{booking.category}</Text>
          </View>
          {!terminal ? (
            <Badge label={booking.status} tone="info" />
          ) : (
            <Badge label={booking.status} tone="error" />
          )}
        </View>

        {terminal ? (
          <View style={styles.terminalBox}>
            <Ionicons name={booking.status === 'Cancelled' ? 'close-circle' : 'ban'} size={28} color={colors.error} />
            <Text style={styles.terminalTitle}>Order {booking.status}</Text>
            {(booking.cancelReason || booking.rejectReason) ? (
              <Text style={styles.terminalReason}>Reason: {booking.cancelReason ?? booking.rejectReason}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.timeline}>
            {BOOKING_STAGES.map((stage, i) => {
              const done = i <= currentIndex;
              const isLast = i === BOOKING_STAGES.length - 1;
              const ts = timestampFor(stage, booking.history);
              return (
                <View key={stage} style={styles.stageRow}>
                  <View style={styles.stageLeft}>
                    <View style={[styles.stageDot, done && styles.stageDotDone]}>
                      {done ? <Ionicons name="checkmark" size={12} color={colors.white} /> : null}
                    </View>
                    {!isLast ? <View style={[styles.stageLine, done && styles.stageLineDone]} /> : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: isLast ? 0 : 18 }}>
                    <Text style={[styles.stageLabel, done && styles.stageLabelDone]}>{stage}</Text>
                    {ts ? <Text style={styles.stageTime}>{ts}</Text> : <Text style={styles.stagePending}>Pending</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
          {!terminal && !booking.balancePaid && balanceDue > 0 ? (
            <Button label={`Pay Balance ₹${balanceDue}`} style={{ flex: 1 }} onPress={() => router.push(`/order/${booking.id}/balance-payment` as any)} />
          ) : (
            <Button label="View Invoice" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/order/${booking.id}/invoice` as any)} />
          )}
          <Button label="Re-order" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/order/${booking.id}/reorder` as any)} />
        </View>
        <Pressable style={styles.complaintLink} onPress={() => router.push({ pathname: '/profile/complaints/new', params: { orderId: booking.id } } as any)}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
          <Text style={styles.complaintText}>Report an issue with this order</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  tailorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.section },
  tailorImg: { width: 48, height: 48, borderRadius: 10 },
  tailorName: { ...type.cardTitle, fontSize: 15, color: colors.text },
  tailorSub: { ...type.supporting, color: colors.textSecondary },
  timeline: { paddingLeft: 4 },
  stageRow: { flexDirection: 'row' },
  stageLeft: { alignItems: 'center', width: 28 },
  stageDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center' },
  stageDotDone: { backgroundColor: colors.success },
  stageLine: { width: 2, flex: 1, backgroundColor: colors.disabledBg, marginTop: 2 },
  stageLineDone: { backgroundColor: colors.success },
  stageLabel: { ...type.body, color: colors.textSecondary, marginLeft: 10 },
  stageLabelDone: { fontFamily: 'Inter_600SemiBold', color: colors.text },
  stageTime: { ...type.supporting, color: colors.textSecondary, marginLeft: 10, marginTop: 2 },
  stagePending: { ...type.supporting, color: colors.disabledText, marginLeft: 10, marginTop: 2 },
  terminalBox: { alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.section, gap: 6 },
  terminalTitle: { ...type.cardTitle, color: colors.text },
  terminalReason: { ...type.supporting, color: colors.textSecondary, textAlign: 'center' },
  complaintLink: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  complaintText: { ...type.supporting, color: colors.error, fontFamily: 'Inter_500Medium' },
});
