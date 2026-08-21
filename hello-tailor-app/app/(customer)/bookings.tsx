// Ported from customer-app/app/(tabs)/bookings.tsx — reads useCustomerBookings() instead of
// the old app's local `orders` mock array. Bucketing: Booking.status -> Active/Completed/Cancelled.
import { useMemo, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing } from '@/theme';
import SegmentedControl from '@/components/ui/SegmentedControl';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useCustomerBookings, useStore } from '@/store/useStore';
import type { Booking } from '@/store/types';

const TABS = ['All', 'Active', 'Completed', 'Cancelled'] as const;

function bucketFor(status: Booking['status']): 'Active' | 'Completed' | 'Cancelled' {
  if (status === 'Delivered') return 'Completed';
  if (status === 'Cancelled' || status === 'Rejected') return 'Cancelled';
  return 'Active';
}

function toneFor(bucket: ReturnType<typeof bucketFor>): 'info' | 'success' | 'error' {
  return bucket === 'Active' ? 'info' : bucket === 'Completed' ? 'success' : 'error';
}

function BookingCard({ booking }: { booking: Booking }) {
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking.tailorId));
  const bucket = bucketFor(booking.status);
  return (
    <Card onPress={() => router.push(`/order/${booking.id}` as any)} style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Image source={{ uri: tailor?.image }} style={styles.img} />
        <View style={{ flex: 1 }}>
          <Text style={styles.id}>{booking.id}</Text>
          <Text style={styles.sub} numberOfLines={1}>{booking.category} • {booking.tailorName}</Text>
          <Text style={styles.sub}>Booked {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</Text>
        </View>
        <Text style={styles.amount}>₹{booking.amount}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <Badge label={bucket === 'Active' ? booking.status : bucket} tone={toneFor(bucket)} />
        <Text style={styles.viewLink}>View Details ›</Text>
      </View>
    </Card>
  );
}

export default function BookingsTab() {
  const bookings = useCustomerBookings();
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  const list = useMemo(
    () => (tab === 'All' ? bookings : bookings.filter((b) => bucketFor(b.status) === tab)),
    [bookings, tab]
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>My Bookings</Text>
      <View style={{ paddingHorizontal: spacing.screenH, marginBottom: spacing.md }}>
        <SegmentedControl options={[...TABS]} value={tab} onChange={(v) => setTab(v as (typeof TABS)[number])} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24 }}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          <EmptyState icon="calendar-outline" title="No Bookings Yet" message="You haven't placed any bookings in this category yet." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  title: { ...type.pageTitle, color: colors.text, paddingHorizontal: spacing.screenH, paddingTop: 12, paddingBottom: spacing.md },
  img: { width: 56, height: 56, borderRadius: 10 },
  id: { ...type.cardTitle, fontSize: 14, color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  amount: { ...type.cardTitle, fontSize: 15, color: colors.primary },
  viewLink: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
