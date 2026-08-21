import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenHeader, StatusPill } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard,
} from '@/components/OrderDetailShared';
import { StatusStepper } from '@/components/StatusStepper';
import { ReasonSheet } from '@/components/ReasonSheet';
import { useStore, ORDER_STAGES } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

const CANCEL_REASONS = [
  'Customer requested cancellation',
  'Unable to source required fabric',
  'Scheduling conflict',
  'Payment not received',
  'Other',
];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const advanceOrderStage = useStore((s) => s.advanceOrderStage);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const [cancelVisible, setCancelVisible] = useState(false);

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order" onBack={() => router.back()} />
        <Text style={styles.notFound}>Order not found.</Text>
      </View>
    );
  }

  const isTerminal = order.status === 'Completed' || order.status === 'Cancelled' || order.status === 'Rejected';
  const stageIdx = ORDER_STAGES.indexOf(order.status as any);
  const nextStage = !isTerminal && stageIdx >= 0 && stageIdx < ORDER_STAGES.length - 1 ? ORDER_STAGES[stageIdx + 1] : null;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={order.id}
        onBack={() => router.back()}
        right={<StatusPill label={order.status} tone={order.status === 'Cancelled' ? 'error' : order.status === 'Completed' ? 'success' : 'info'} />}
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
        <MeasurementsPreviewCard order={order} onOpen={() => router.push(`/order/${order.id}/measurements`)} />
        <View style={{ height: spacing.md }} />
        <DesignPhotosPreviewCard order={order} onOpen={() => router.push(`/order/${order.id}/photos`)} />

        {!isTerminal && (
          <Pressable style={styles.cancelLink} onPress={() => setCancelVisible(true)}>
            <Text style={styles.cancelLinkText}>Cancel this order</Text>
          </Pressable>
        )}
      </ScrollView>

      {!isTerminal && nextStage && (
        <View style={styles.footer}>
          <Button label={`Update Status: ${nextStage}`} onPress={() => advanceOrderStage(order.id, nextStage as any)} icon="arrow-forward-circle-outline" />
        </View>
      )}

      <ReasonSheet
        visible={cancelVisible}
        onClose={() => setCancelVisible(false)}
        onConfirm={(reason, note) => {
          cancelOrder(order.id, note ? `${reason} — ${note}` : reason);
          setCancelVisible(false);
          router.replace('/(tabs)/orders');
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
