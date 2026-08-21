// Ported from tailor-app/app/booking/[id].tsx — rewired to the shared Booking record and
// acceptBooking/rejectBooking store actions. ReasonSheet + REJECT_REASONS replace the source
// app's dedicated RejectSheet (merged as a generic component in the shared components/tailor).
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StatusPill } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import { CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard } from '@/components/tailor/OrderDetailShared';
import { ReasonSheet, REJECT_REASONS } from '@/components/tailor/ReasonSheet';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const acceptBooking = useStore((s) => s.acceptBooking);
  const rejectBooking = useStore((s) => s.rejectBooking);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [result, setResult] = useState<'accepted' | 'rejected' | null>(null);

  if (!booking) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Booking" />
        <Text style={styles.notFound}>Booking not found.</Text>
      </View>
    );
  }

  if (result === 'accepted') {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultTitle}>Booking Accepted!</Text>
        <Text style={styles.resultSub}>{booking.customerName}'s order has been added to your active orders.</Text>
        <Button label="View Order" onPress={() => router.replace(`/(tailor)/order/${booking.id}` as any)} style={{ marginTop: spacing.xl }} />
        <Button label="Back to Bookings" variant="secondary" onPress={() => router.replace('/(tailor)/(tabs)/bookings' as any)} style={{ marginTop: spacing.md }} />
      </View>
    );
  }
  if (result === 'rejected') {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="close-circle" size={72} color={colors.error} />
        <Text style={styles.resultTitle}>Booking Rejected</Text>
        <Text style={styles.resultSub}>The customer has been notified of the rejection.</Text>
        <Button label="Back to Bookings" onPress={() => router.replace('/(tailor)/(tabs)/bookings' as any)} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  const isPending = booking.status === 'Requested';

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Booking Request"
        right={!isPending ? <StatusPill label={booking.status} tone="info" /> : undefined}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomerInfoCard order={booking} />
        <View style={{ height: spacing.md }} />
        <CustomerNotesCard notes={booking.notes} />
        {booking.notes && <View style={{ height: spacing.md }} />}
        <FinancialSummaryCard order={booking} />
        <View style={{ height: spacing.md }} />
        <MeasurementsPreviewCard order={booking} onOpen={() => router.push(`/(tailor)/order/${booking.id}/measurements` as any)} />
        <View style={{ height: spacing.md }} />
        <DesignPhotosPreviewCard order={booking} onOpen={() => router.push(`/(tailor)/order/${booking.id}/photos` as any)} />

        {!isPending && (
          <Button label="View Full Order Details" onPress={() => router.replace(`/(tailor)/order/${booking.id}` as any)} style={{ marginTop: spacing.xl }} />
        )}
      </ScrollView>

      {isPending && (
        <View style={styles.footer}>
          <Button label="Reject" variant="destructive" onPress={() => setRejectVisible(true)} style={{ flex: 1, marginRight: spacing.md }} />
          <Button label="Accept Booking" variant="primary" onPress={() => { acceptBooking(booking.id); setResult('accepted'); }} style={{ flex: 2 }} />
        </View>
      )}

      <ReasonSheet
        visible={rejectVisible}
        onClose={() => setRejectVisible(false)}
        onConfirm={(reason, note) => {
          rejectBooking(booking.id, reason, note);
          setRejectVisible(false);
          setResult('rejected');
        }}
        title="Reject Booking"
        reasons={REJECT_REASONS}
        confirmLabel="Reject"
        confirmMessage="This will reject the booking and notify the customer. This cannot be undone."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  footer: { flexDirection: 'row', padding: spacing.lg, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  notFound: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  resultContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  resultTitle: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary, marginTop: spacing.lg },
  resultSub: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
