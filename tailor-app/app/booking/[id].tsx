import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, StatusPill } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { CustomerInfoCard, CustomerNotesCard, FinancialSummaryCard, MeasurementsPreviewCard, DesignPhotosPreviewCard } from '@/components/OrderDetailShared';
import { RejectSheet } from '@/components/RejectSheet';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const acceptOrder = useStore((s) => s.acceptOrder);
  const rejectOrder = useStore((s) => s.rejectOrder);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [result, setResult] = useState<'accepted' | 'rejected' | null>(null);

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Booking" onBack={() => router.back()} />
        <Text style={styles.notFound}>Booking not found.</Text>
      </View>
    );
  }

  if (result === 'accepted') {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultTitle}>Booking Accepted!</Text>
        <Text style={styles.resultSub}>{order.customerName}'s order has been added to your active orders.</Text>
        <Button label="View Order" onPress={() => router.replace(`/order/${order.id}`)} style={{ marginTop: spacing.xl }} />
        <Button label="Back to Bookings" variant="secondary" onPress={() => router.replace('/(tabs)/bookings')} style={{ marginTop: spacing.md }} />
      </View>
    );
  }
  if (result === 'rejected') {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="close-circle" size={72} color={colors.error} />
        <Text style={styles.resultTitle}>Booking Rejected</Text>
        <Text style={styles.resultSub}>The customer has been notified of the rejection.</Text>
        <Button label="Back to Bookings" onPress={() => router.replace('/(tabs)/bookings')} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  const isPending = order.status === 'requested';

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Booking Request"
        onBack={() => router.back()}
        right={!isPending ? <StatusPill label={order.status} tone="info" /> : undefined}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomerInfoCard order={order} />
        <View style={{ height: spacing.md }} />
        <CustomerNotesCard notes={order.notes} />
        {order.notes && <View style={{ height: spacing.md }} />}
        <FinancialSummaryCard order={order} />
        <View style={{ height: spacing.md }} />
        <MeasurementsPreviewCard order={order} onOpen={() => router.push(`/order/${order.id}/measurements`)} />
        <View style={{ height: spacing.md }} />
        <DesignPhotosPreviewCard order={order} onOpen={() => router.push(`/order/${order.id}/photos`)} />

        {!isPending && (
          <Button label="View Full Order Details" onPress={() => router.replace(`/order/${order.id}`)} style={{ marginTop: spacing.xl }} />
        )}
      </ScrollView>

      {isPending && (
        <View style={styles.footer}>
          <Button label="Reject" variant="destructive" onPress={() => setRejectVisible(true)} fullWidth={false} style={{ flex: 1, marginRight: spacing.md }} />
          <Button label="Accept Booking" variant="primary" onPress={() => { acceptOrder(order.id); setResult('accepted'); }} fullWidth={false} style={{ flex: 2 }} />
        </View>
      )}

      <RejectSheet
        visible={rejectVisible}
        onClose={() => setRejectVisible(false)}
        onConfirm={(reason, note) => {
          rejectOrder(order.id, reason, note);
          setRejectVisible(false);
          setResult('rejected');
        }}
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
