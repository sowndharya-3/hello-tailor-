// Ported from tailor-app/app/(tabs)/index.tsx — rewired to the shared store: profile fields
// now come off useMyTailor()/useStore, orders come off useMyBookings() (so a booking created
// in the customer role shows up here automatically), reviews are filtered by tailorId.
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import { MetricCard, StatusPill } from '@/components/ui/Misc';
import StarRating from '@/components/ui/StarRating';
import { LineChart } from '@/components/ui/Chart';
import { useStore, useMyTailor, useMyBookings } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { colors, font, spacing } from '@/theme';

export default function Dashboard() {
  const tailor = useMyTailor();
  const toggleOnline = useStore((s) => s.toggleOnline);
  const bookings = useMyBookings();
  const notifications = useStore(useShallow((s) => s.notifications.filter((n) => n.audience === 'tailor')));
  const reviews = useStore(useShallow((s) => s.reviews.filter((r) => r.tailorId === s.myTailorId)));
  const unread = notifications.filter((n) => !n.read).length;

  const requested = bookings.filter((b) => b.status === 'Requested');
  const today = new Date().toDateString();
  const todayOrders = bookings.filter((b) => new Date(b.deliveryDate).toDateString() === today && b.status !== 'Rejected' && b.status !== 'Cancelled');
  const pending = bookings.filter((b) => !['Requested', 'Delivered', 'Rejected', 'Cancelled'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'Delivered');
  const pendingDelivery = bookings.filter((b) => b.status === 'Ready');
  const todayIncome = (completed.reduce((sum, b) => sum + b.amount, 0) % 5000) + 1200;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
        <Pressable onPress={() => router.push('/(tailor)/notifications' as any)} style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
          {unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unread}</Text></View>}
        </Pressable>
      </View>

      <View style={styles.greetingBar}>
        <Pressable style={styles.profileChip} onPress={() => router.push('/(tailor)/(tabs)/profile' as any)}>
          <Image source={{ uri: tailor.image }} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Hi, {tailor.name.split(' ')[0]} 👋</Text>
            <Text style={styles.shopName} numberOfLines={1}>{tailor.shopName}</Text>
          </View>
        </Pressable>
        <View style={styles.onlineToggle}>
          <Text style={styles.onlineText}>{tailor.online ? 'Online' : 'Offline'}</Text>
          <Switch value={tailor.online} onValueChange={toggleOnline} trackColor={{ false: colors.disabledBg, true: colors.success }} thumbColor={colors.white} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.metricsGrid}>
          <MetricCard label="New Bookings" value={String(requested.length)} icon="calendar-outline" tone="ocean" onPress={() => router.push('/(tailor)/(tabs)/bookings' as any)} />
          <MetricCard label="Today Orders" value={String(todayOrders.length)} icon="today-outline" tone="navy" onPress={() => router.push('/(tailor)/(tabs)/orders' as any)} />
          <MetricCard label="Pending Orders" value={String(pending.length)} icon="hourglass-outline" tone="gold" onPress={() => router.push('/(tailor)/(tabs)/orders' as any)} />
          <MetricCard label="Completed" value={String(completed.length)} icon="checkmark-done-outline" tone="success" onPress={() => router.push('/(tailor)/(tabs)/orders' as any)} />
        </View>
        <MetricCard label="Today's Income" value={`₹${todayIncome.toLocaleString('en-IN')}`} icon="cash-outline" tone="gold" onPress={() => router.push('/(tailor)/(tabs)/income' as any)} />

        <SectionHeader title="New Booking Requests" onSeeAll={() => router.push('/(tailor)/(tabs)/bookings' as any)} />
        {requested.length === 0 ? (
          <Card><Text style={styles.emptyText}>No new booking requests right now.</Text></Card>
        ) : requested.slice(0, 3).map((b) => (
          <Pressable key={b.id} onPress={() => router.push(`/(tailor)/booking/${b.id}` as any)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{b.customerName}</Text>
                  <Text style={styles.cardSub}>{b.category} · ₹{b.amount.toLocaleString('en-IN')}</Text>
                </View>
                <StatusPill label="New" tone="info" icon="time-outline" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Today's Schedule" onSeeAll={() => router.push('/(tailor)/(tabs)/orders' as any)} />
        {todayOrders.length === 0 ? (
          <Card><Text style={styles.emptyText}>Nothing scheduled for delivery today.</Text></Card>
        ) : todayOrders.slice(0, 3).map((b) => (
          <Pressable key={b.id} onPress={() => router.push(`/(tailor)/order/${b.id}` as any)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{b.customerName} · {b.category}</Text>
                  <Text style={styles.cardSub}>Due today</Text>
                </View>
                <StatusPill label={b.status} tone="warning" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Pending Delivery" onSeeAll={() => router.push('/(tailor)/(tabs)/orders' as any)} />
        {pendingDelivery.length === 0 ? (
          <Card><Text style={styles.emptyText}>No orders waiting for handover.</Text></Card>
        ) : pendingDelivery.slice(0, 3).map((b) => (
          <Pressable key={b.id} onPress={() => router.push(`/(tailor)/order/${b.id}` as any)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{b.customerName}</Text>
                <StatusPill label="Ready" tone="success" icon="checkmark-circle-outline" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Income Overview" onSeeAll={() => router.push('/(tailor)/(tabs)/income' as any)} />
        <Card>
          <Text style={styles.incomeAmount}>₹{(todayIncome * 6).toLocaleString('en-IN')}</Text>
          <Text style={styles.cardSub}>Last 7 days</Text>
          <View style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <LineChart data={[1200, 1800, 900, 2400, 1600, 2100, todayIncome]} width={280} height={80} />
          </View>
        </Card>

        <SectionHeader title="Recent Reviews" onSeeAll={() => router.push('/(tailor)/reviews' as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
          {reviews.slice(0, 4).map((r) => (
            <Card key={r.id} style={{ width: 220, marginRight: spacing.md }}>
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                  <Text style={styles.cardTitle} numberOfLines={1}>{r.customerName}</Text>
                </View>
              </View>
              <StarRating rating={r.rating} size={13} />
              <Text style={styles.reviewText} numberOfLines={3}>{r.text}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <Pressable onPress={onSeeAll}><Text style={styles.seeAll}>See all</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 54, paddingBottom: spacing.lg },
  logo: { height: 30, width: 120 },
  bellWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: colors.white, fontFamily: font.semibold, fontSize: 9 },
  greetingBar: { backgroundColor: colors.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  profileChip: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.md, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  greeting: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
  shopName: { fontFamily: font.regular, fontSize: 12, color: '#C9D8E3', marginTop: 2, maxWidth: 160 },
  onlineToggle: { alignItems: 'center' },
  onlineText: { fontFamily: font.medium, fontSize: 11, color: colors.white, marginBottom: 4 },
  body: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  sectionHeading: { fontFamily: font.semibold, fontSize: 18, color: colors.textPrimary },
  seeAll: { fontFamily: font.medium, fontSize: 13, color: colors.ocean },
  emptyText: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary },
  cardSub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  incomeAmount: { fontFamily: font.bold, fontSize: 24, color: colors.textPrimary },
  reviewAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
  reviewText: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 8, lineHeight: 17 },
});
