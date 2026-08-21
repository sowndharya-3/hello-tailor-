import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/Card';
import { MetricCard, StatusPill, StarRating } from '@/components/ui/Misc';
import { LineChart } from '@/components/ui/Chart';
import { useStore } from '@/store/useStore';
import { reviews } from '@/data/mockData';
import { colors, font, radii, spacing } from '@/theme';

export default function Dashboard() {
  const profile = useStore((s) => s.profile);
  const toggleOnline = useStore((s) => s.toggleOnline);
  const orders = useStore((s) => s.orders);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  const requested = orders.filter((o) => o.status === 'requested');
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.deliveryDate).toDateString() === today && o.status !== 'Rejected' && o.status !== 'Cancelled');
  const pending = orders.filter((o) => !['requested', 'Completed', 'Rejected', 'Cancelled'].includes(o.status));
  const completed = orders.filter((o) => o.status === 'Completed');
  const pendingDelivery = orders.filter((o) => o.status === 'Ready');
  const todayIncome = completed.reduce((sum, o) => sum + o.amount, 0) % 5000 + 1200;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Logo height={34} />
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push('/notifications')} style={styles.bellWrap}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            {unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unread}</Text></View>}
          </Pressable>
        </View>
      </View>

      <View style={styles.greetingBar}>
        <Pressable style={styles.profileChip} onPress={() => router.push('/(tabs)/profile')}>
          <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Hi, {profile.name.split(' ')[0]} 👋</Text>
            <Text style={styles.shopName} numberOfLines={1}>{profile.shopName}</Text>
          </View>
        </Pressable>
        <View style={styles.onlineToggle}>
          <Text style={styles.onlineText}>{profile.online ? 'Online' : 'Offline'}</Text>
          <Switch value={profile.online} onValueChange={toggleOnline} trackColor={{ false: colors.disabledBg, true: colors.success }} thumbColor={colors.white} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.metricsGrid}>
          <MetricCard label="New Bookings" value={String(requested.length)} icon="calendar-outline" tone="ocean" onPress={() => router.push('/(tabs)/bookings')} />
          <MetricCard label="Today Orders" value={String(todayOrders.length)} icon="today-outline" tone="navy" onPress={() => router.push('/(tabs)/orders')} />
          <MetricCard label="Pending Orders" value={String(pending.length)} icon="hourglass-outline" tone="gold" onPress={() => router.push('/(tabs)/orders')} />
          <MetricCard label="Completed" value={String(completed.length)} icon="checkmark-done-outline" tone="success" onPress={() => router.push('/(tabs)/orders')} />
        </View>
        <MetricCard label="Today's Income" value={`₹${todayIncome.toLocaleString('en-IN')}`} icon="cash-outline" tone="gold" onPress={() => router.push('/(tabs)/income')} />

        <SectionHeader title="New Booking Requests" onSeeAll={() => router.push('/(tabs)/bookings')} />
        {requested.length === 0 ? (
          <Card><Text style={styles.emptyText}>No new booking requests right now.</Text></Card>
        ) : requested.slice(0, 3).map((o) => (
          <Pressable key={o.id} onPress={() => router.push(`/booking/${o.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{o.customerName}</Text>
                  <Text style={styles.cardSub}>{o.category} · ₹{o.amount.toLocaleString('en-IN')}</Text>
                </View>
                <StatusPill label="New" tone="info" icon="time-outline" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Today's Schedule" onSeeAll={() => router.push('/(tabs)/orders')} />
        {todayOrders.length === 0 ? (
          <Card><Text style={styles.emptyText}>Nothing scheduled for delivery today.</Text></Card>
        ) : todayOrders.slice(0, 3).map((o) => (
          <Pressable key={o.id} onPress={() => router.push(`/order/${o.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{o.customerName} · {o.category}</Text>
                  <Text style={styles.cardSub}>Due today</Text>
                </View>
                <StatusPill label={o.status} tone="warning" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Pending Delivery" onSeeAll={() => router.push('/(tabs)/orders')} />
        {pendingDelivery.length === 0 ? (
          <Card><Text style={styles.emptyText}>No orders waiting for handover.</Text></Card>
        ) : pendingDelivery.slice(0, 3).map((o) => (
          <Pressable key={o.id} onPress={() => router.push(`/order/${o.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{o.customerName}</Text>
                <StatusPill label="Ready" tone="success" icon="checkmark-circle-outline" />
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionHeader title="Income Overview" onSeeAll={() => router.push('/(tabs)/income')} />
        <Card>
          <Text style={styles.incomeAmount}>₹{(todayIncome * 6).toLocaleString('en-IN')}</Text>
          <Text style={styles.cardSub}>Last 7 days</Text>
          <View style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <LineChart data={[1200, 1800, 900, 2400, 1600, 2100, todayIncome]} width={280} height={80} />
          </View>
        </Card>

        <SectionHeader title="Recent Reviews" onSeeAll={() => router.push('/reviews')} />
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
              <Text style={styles.reviewText} numberOfLines={3}>{r.comment}</Text>
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
  headerRight: { flexDirection: 'row', alignItems: 'center' },
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
