// Ported from tailor-app/app/(tabs)/orders.tsx — driven by useMyBookings(); 'Delivered' is the
// shared store's terminal success stage (source app's 'Completed').
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import { StatusPill } from '@/components/ui/Misc';
import { useMyBookings } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

const STAGE_TONE: Record<string, 'info' | 'warning' | 'success'> = {
  Accepted: 'info', 'Pickup Scheduled': 'info', 'Cloth Received': 'info', 'Stitching Started': 'warning',
  'In Progress': 'warning', 'Quality Check': 'warning', Ready: 'success', 'Out for Delivery': 'success',
};

export default function Orders() {
  const bookings = useMyBookings();
  const [tab, setTab] = useState('Daily');

  const filtered = useMemo(() => {
    if (tab === 'Daily') return bookings.filter((b) => !['Requested', 'Delivered', 'Rejected', 'Cancelled'].includes(b.status));
    if (tab === 'Completed') return bookings.filter((b) => b.status === 'Delivered');
    return bookings.filter((b) => b.status === 'Cancelled');
  }, [bookings, tab]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Orders" />
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <SegmentedControl options={['Daily', 'Completed', 'Cancelled']} value={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <EmptyState icon="receipt-outline" title="No Orders" message={`No ${tab.toLowerCase()} orders to show.`} />
        ) : filtered.map((b) => (
          <Pressable key={b.id} onPress={() => router.push(`/(tailor)/order/${b.id}` as any)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>{b.id}</Text>
                  <Text style={styles.name}>{b.customerName} · {b.category}</Text>
                </View>
                {tab === 'Daily' && <StatusPill label={b.status} tone={STAGE_TONE[b.status] ?? 'info'} />}
                {tab === 'Completed' && <StatusPill label="Delivered" tone="success" icon="checkmark-circle-outline" />}
                {tab === 'Cancelled' && <StatusPill label="Cancelled" tone="error" icon="close-circle-outline" />}
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="cube-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText}>Delivery: {new Date(b.deliveryDate).toLocaleDateString('en-IN')}</Text>
                <Text style={styles.amount}>₹{b.amount.toLocaleString('en-IN')}</Text>
              </View>
              {tab === 'Cancelled' && b.cancelReason && (
                <Text style={styles.cancelReason} numberOfLines={2}>Reason: {b.cancelReason}</Text>
              )}
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 32 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontFamily: font.medium, fontSize: 11, color: colors.textSecondary },
  name: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  metaText: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginLeft: 4, flex: 1 },
  amount: { fontFamily: font.bold, fontSize: 14, color: colors.textPrimary },
  cancelReason: { fontFamily: font.regular, fontSize: 12, color: colors.error, marginTop: spacing.sm },
});
