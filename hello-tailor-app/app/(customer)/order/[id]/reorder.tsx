// Ported from customer-app/app/order/[id]/reorder.tsx — resets the booking draft and prefills
// tailorId/category/personId from the old booking, then routes into the booking flow.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

export default function Reorder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));
  const resetBooking = useStore((s) => s.resetBooking);
  const updateBooking = useStore((s) => s.updateBooking);
  const [confirming, setConfirming] = useState(false);

  if (!booking) {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title="Re-order" />
        <ErrorState icon="alert-circle-outline" title="Order Not Found" message="We couldn't find this order." />
      </View>
    );
  }

  const proceed = () => {
    resetBooking();
    updateBooking({ tailorId: booking.tailorId, category: booking.category, personId: 'self' });
    router.replace(`/booking/${booking.tailorId}/cloth-details` as any);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Re-order" subtitle={booking.id} />
      <View style={{ padding: spacing.screenH }}>
        <View style={styles.card}>
          <Image source={{ uri: tailor?.image }} style={styles.img} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{tailor?.shopName ?? booking.tailorName}</Text>
            <Text style={styles.sub}>{booking.category} • Same measurement & design will be prefilled</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
          <Text style={styles.infoText}>We'll prefill the tailor, category, saved measurement and design references from this order. You can review and edit everything before confirming.</Text>
        </View>

        {!confirming ? (
          <Button label="Re-order with Same Details" onPress={() => setConfirming(true)} style={{ marginTop: spacing.lg }} />
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirm Re-order?</Text>
            <Text style={styles.confirmSub}>You'll be taken through the booking flow with your previous choices prefilled.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setConfirming(false)} />
              <Button label="Confirm" style={{ flex: 1 }} onPress={proceed} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  img: { width: 52, height: 52, borderRadius: 12 },
  name: { ...type.cardTitle, fontSize: 15, color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  infoBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.infoBg, borderRadius: radius.input, padding: 12, marginTop: spacing.lg },
  infoText: { flex: 1, ...type.supporting, color: colors.secondary },
  confirmBox: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginTop: spacing.lg },
  confirmTitle: { ...type.cardTitle, color: colors.text },
  confirmSub: { ...type.body, color: colors.textSecondary, marginTop: 4 },
});
