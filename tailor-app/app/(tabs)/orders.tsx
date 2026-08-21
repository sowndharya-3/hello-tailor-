import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ScreenHeader, SegmentedControl, StatusPill, EmptyState } from '@/components/ui/Misc';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

const STAGE_TONE: Record<string, 'info' | 'warning' | 'success'> = {
  Accepted: 'info', 'Cloth Received': 'info', 'Stitching Started': 'warning',
  'In Progress': 'warning', 'Quality Check': 'warning', Ready: 'success',
};

export default function Orders() {
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState('Daily');

  const filtered = useMemo(() => {
    if (tab === 'Daily') return orders.filter((o) => !['requested', 'Completed', 'Rejected', 'Cancelled'].includes(o.status));
    if (tab === 'Completed') return orders.filter((o) => o.status === 'Completed');
    return orders.filter((o) => o.status === 'Cancelled');
  }, [orders, tab]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Orders" />
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <SegmentedControl options={['Daily', 'Completed', 'Cancelled']} value={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <EmptyState icon="receipt-outline" title="No Orders" message={`No ${tab.toLowerCase()} orders to show.`} />
        ) : filtered.map((o) => (
          <Pressable key={o.id} onPress={() => router.push(`/order/${o.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>{o.id}</Text>
                  <Text style={styles.name}>{o.customerName} · {o.category}</Text>
                </View>
                {tab === 'Daily' && <StatusPill label={o.status} tone={STAGE_TONE[o.status] ?? 'info'} />}
                {tab === 'Completed' && <StatusPill label="Completed" tone="success" icon="checkmark-circle-outline" />}
                {tab === 'Cancelled' && <StatusPill label="Cancelled" tone="error" icon="close-circle-outline" />}
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="cube-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText}>Delivery: {new Date(o.deliveryDate).toLocaleDateString('en-IN')}</Text>
                <Text style={styles.amount}>₹{o.amount.toLocaleString('en-IN')}</Text>
              </View>
              {tab === 'Cancelled' && o.cancelReason && (
                <Text style={styles.cancelReason} numberOfLines={2}>Reason: {o.cancelReason}</Text>
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
