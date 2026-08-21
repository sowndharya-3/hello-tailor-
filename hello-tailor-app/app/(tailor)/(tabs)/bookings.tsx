// Ported from tailor-app/app/(tabs)/bookings.tsx — reads useMyBookings() instead of a local
// orders array so bookings created by the customer role show up immediately.
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import { StatusPill } from '@/components/ui/Misc';
import { useMyBookings } from '@/store/useStore';
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
  const bookings = useMyBookings();
  const [tab, setTab] = useState('Pending');

  const filtered = useMemo(() => {
    if (tab === 'Pending') return bookings.filter((b) => b.status === 'Requested');
    if (tab === 'Accepted') return bookings.filter((b) => b.status !== 'Requested' && b.status !== 'Rejected' && b.status !== 'Cancelled');
    return bookings.filter((b) => b.status === 'Rejected');
  }, [bookings, tab]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bookings" />
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <SegmentedControl options={['Pending', 'Accepted', 'Rejected']} value={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No Bookings" message={`You don't have any ${tab.toLowerCase()} bookings right now.`} />
        ) : filtered.map((b) => (
          <Pressable key={b.id} onPress={() => router.push(`/(tailor)/booking/${b.id}` as any)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.topRow}>
                <Image source={{ uri: b.customerAvatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{b.customerName}</Text>
                  <Text style={styles.category}>{b.category}</Text>
                </View>
                <Text style={styles.amount}>₹{b.amount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText}>Booked {new Date(b.bookingDate).toLocaleDateString('en-IN')}</Text>
                <Ionicons name="cube-outline" size={13} color={colors.textSecondary} style={{ marginLeft: 10 }} />
                <Text style={styles.metaText}>Deliver {new Date(b.deliveryDate).toLocaleDateString('en-IN')}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.metaText} numberOfLines={1}>{b.location}</Text>
                <StatusPill label={b.pickupType} tone="neutral" />
              </View>
              {tab === 'Pending' && (
                <View style={styles.timerRow}>
                  <Ionicons name="alarm-outline" size={13} color={colors.warning} />
                  <Text style={styles.timerText}>{hoursLeft(b.requestedAt)}</Text>
                </View>
              )}
              {tab === 'Rejected' && b.rejectReason && (
                <Text style={styles.rejectReason} numberOfLines={2}>Reason: {b.rejectReason}</Text>
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
