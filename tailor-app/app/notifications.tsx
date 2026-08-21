import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, EmptyState } from '@/components/ui/Misc';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import type { NotificationType } from '@/data/mockData';
import { colors, font, spacing } from '@/theme';

const ICONS: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  booking: 'calendar-outline',
  cancelled: 'close-circle-outline',
  payment: 'cash-outline',
  order_reminder: 'alarm-outline',
  delivery_reminder: 'cube-outline',
  review: 'star-outline',
  membership: 'diamond-outline',
  advertisement: 'megaphone-outline',
  system: 'information-circle-outline',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Notifications() {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);

  const groups: { title: string; items: typeof notifications }[] = [
    { title: 'New', items: notifications.filter((n) => !n.read) },
    { title: 'Earlier', items: notifications.filter((n) => n.read) },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        onBack={() => router.back()}
        right={<Pressable onPress={markAllRead}><Text style={styles.markAll}>Mark all read</Text></Pressable>}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {notifications.length === 0 ? (
          <EmptyState icon="notifications-outline" title="No Notifications" message="You're all caught up. New alerts will show up here." />
        ) : groups.map((g) => g.items.length > 0 && (
          <View key={g.title}>
            <Text style={styles.groupTitle}>{g.title}</Text>
            {g.items.map((n) => (
              <Pressable key={n.id} onPress={() => markRead(n.id)}>
                <Card style={[styles.card, !n.read && styles.unreadCard]}>
                  <View style={styles.row}>
                    <View style={[styles.iconWrap, !n.read && styles.iconWrapUnread]}>
                      <Ionicons name={ICONS[n.type]} size={18} color={!n.read ? colors.ocean : colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{n.title}</Text>
                      <Text style={styles.body}>{n.body}</Text>
                      <Text style={styles.time}>{timeAgo(n.at)}</Text>
                    </View>
                    {!n.read && <View style={styles.dot} />}
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  markAll: { fontFamily: font.medium, fontSize: 12, color: colors.ocean },
  groupTitle: { fontFamily: font.semibold, fontSize: 13, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, textTransform: 'uppercase' },
  card: { marginBottom: spacing.sm },
  unreadCard: { backgroundColor: colors.infoBg, borderColor: '#CDE8F9' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  iconWrapUnread: { backgroundColor: colors.white },
  title: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  body: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  time: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ocean, marginTop: 4 },
});
