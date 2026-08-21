import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ScreenHeader, SegmentedControl, StatusPill, EmptyState } from '@/components/ui/Misc';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

function hoursLeft(requestedAt: string) {
  const deadline = new Date(requestedAt).getTime() + 24 * 3600 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return 'Expiring soon';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `Respond within ${h}h ${m}m`;
}

export default function Bookings() {
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState('Pending');

  const filtered = useMemo(() => {
    if (tab === 'Pending') return orders.filter((o) => o.status === 'requested');
    if (tab === 'Accepted') return orders.filter((o) => o.status !== 'requested' && o.status !== 'Rejected' && o.status !== 'Cancelled');
    return orders.filter((o) => o.status === 'Rejected');
  }, [orders, tab]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bookings" />
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <SegmentedControl options={['Pending', 'Accepted', 'Rejected']} value={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No Bookings" message={`You don't have any ${tab.toLowerCase()} bookings right now.`} />
        ) : filtered.map((o) => (
          <Pressable key={o.id} onPress={() => router.push(`/booking/${o.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.topRow}>
                <Image source={{ uri: o.customerAvatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{o.customerName}</Text>
                  <Text style={styles.category}>{o.category}</Text>
                </View>
                <Text style={styles.amount}>₹{o.amount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText}>Booked {new Date(o.bookingDate).toLocaleDateString('en-IN')}</Text>
                <Ionicons name="cube-outline" size={13} color={colors.textSecondary} style={{ marginLeft: 10 }} />
                <Text style={styles.metaText}>Deliver {new Date(o.deliveryDate).toLocaleDateString('en-IN')}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText} numberOfLines={1}>{o.location}</Text>
                <StatusPill label={o.pickupType} tone="neutral" />
              </View>
              {tab === 'Pending' && (
                <View style={styles.timerRow}>
                  <Ionicons name="alarm-outline" size={13} color={colors.warning} />
                  <Text style={styles.timerText}>{hoursLeft(o.requestedAt)}</Text>
                </View>
              )}
              {tab === 'Rejected' && o.rejectReason && (
                <Text style={styles.rejectReason} numberOfLines={2}>Reason: {o.rejectReason}</Text>
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
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.md },
  name: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary },
  category: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  amount: { fontFamily: font.bold, fontSize: 16, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 4 },
  metaText: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, backgroundColor: '#FFF4E5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  timerText: { fontFamily: font.semibold, fontSize: 11, color: colors.warning, marginLeft: 4 },
  rejectReason: { fontFamily: font.regular, fontSize: 12, color: colors.error, marginTop: spacing.sm },
});
