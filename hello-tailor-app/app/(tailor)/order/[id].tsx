// Ported from tailor-app/app/order/[id].tsx — status advance now walks the shared
// BOOKING_STAGES list via advanceBookingStage(); 'Delivered' is the shared store's terminal
// success stage (source app's 'Completed').
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StatusPill } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard,
} from '@/components/tailor/OrderDetailShared';
import { StatusStepper } from '@/components/tailor/StatusStepper';
import { ReasonSheet, CANCEL_REASONS } from '@/components/tailor/ReasonSheet';
import { useStore } from '@/store/useStore';
import { BOOKING_STAGES } from '@/store/types';
import { colors, font, spacing } from '@/theme';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));
  const advanceBookingStage = useStore((s) => s.advanceBookingStage);
  const cancelBooking = useStore((s) => s.cancelBooking);
  const [cancelVisible, setCancelVisible] = useState(false);

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order" />
        <Text style={styles.notFound}>Order not found.</Text>
      </View>
    );
  }

  const isTerminal = order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Rejected';
  const stageIdx = BOOKING_STAGES.indexOf(order.status as any);
  const nextStage = !isTerminal && stageIdx >= 0 && stageIdx < BOOKING_STAGES.length - 1 ? BOOKING_STAGES[stageIdx + 1] : null;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={order.id}
        right={<StatusPill label={order.status} tone={order.status === 'Cancelled' ? 'error' : order.status === 'Delivered' ? 'success' : 'info'} />}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomerInfoCard order={order} />
        <View style={{ height: spacing.md }} />
        <CustomerNotesCard notes={order.notes} />
        {order.notes && <View style={{ height: spacing.md }} />}

        {order.status === 'Cancelled' && order.cancelReason && (
          <>
            <Card style={{ backgroundColor: '#FDECEA', borderColor: '#F5C2C0' }}>
              <Text style={styles.cancelTitle}>Cancellation Reason</Text>
              <Text style={styles.cancelText}>{order.cancelReason}</Text>
            </Card>
            <View style={{ height: spacing.md }} />
          </>
        )}

        {!isTerminal && (
          <>
            <Text style={styles.sectionHeading}>Order Progress</Text>
            <Card>
              <StatusStepper current={order.status} />
            </Card>
            <View style={{ height: spacing.md }} />
          </>
        )}

        <FinancialSummaryCard order={order} />
        <View style={{ height: spacing.md }} />
        <MeasurementsPreviewCard order={order} onOpen={() => router.push(`/(tailor)/order/${order.id}/measurements` as any)} />
        <View style={{ height: spacing.md }} />
        <DesignPhotosPreviewCard order={order} onOpen={() => router.push(`/(tailor)/order/${order.id}/photos` as any)} />

        {!isTerminal && (
          <Pressable style={styles.cancelLink} onPress={() => setCancelVisible(true)}>
            <Text style={styles.cancelLinkText}>Cancel this order</Text>
          </Pressable>
        )}
      </ScrollView>

      {!isTerminal && nextStage && (
        <View style={styles.footer}>
          <Button label={`Update Status: ${nextStage}`} onPress={() => advanceBookingStage(order.id, nextStage)} />
        </View>
      )}

      <ReasonSheet
        visible={cancelVisible}
        onClose={() => setCancelVisible(false)}
        onConfirm={(reason, note) => {
          cancelBooking(order.id, note ? `${reason} — ${note}` : reason);
          setCancelVisible(false);
          router.replace('/(tailor)/(tabs)/orders' as any);
        }}
        title="Cancel Order"
        reasons={CANCEL_REASONS}
        confirmLabel="Cancel Order"
        confirmMessage="This will cancel the order and notify the customer. This cannot be undone."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  notFound: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  sectionHeading: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary, marginBottom: spacing.md },
  cancelTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.error },
  cancelText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginTop: 6, lineHeight: 18 },
  cancelLink: { alignItems: 'center', paddingVertical: spacing.lg },
  cancelLinkText: { fontFamily: font.medium, fontSize: 13, color: colors.error },
  footer: { padding: spacing.lg, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
});
