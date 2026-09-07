// Ported from customer-app/app/(tabs)/notifications.tsx — filters the shared notifications[]
// to audience === 'customer' (old app had no audience field; every notification was the
// customer's). Read/unread wired to markNotificationRead / markAllNotificationsRead('customer').
import React from 'react';
import { View, Text, SectionList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import EmptyState from '@/components/ui/EmptyState';

const typeMeta: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  booking: { icon: 'calendar-outline', label: 'Booking' },
  payment: { icon: 'card-outline', label: 'Payment' },
  progress: { icon: 'construct-outline', label: 'Progress' },
  offers: { icon: 'pricetag-outline', label: 'Offers' },
  membership: { icon: 'ribbon-outline', label: 'Membership' },
  delivery: { icon: 'bicycle-outline', label: 'Delivery' },
  system: { icon: 'settings-outline', label: 'System' },
};
const fallbackMeta = { icon: 'notifications-outline' as const, label: 'Other' };
const metaFor = (t: string) => typeMeta[t] ?? fallbackMeta;

export default function NotificationsTab() {
  const notifications = useStore(useShallow((s) => s.notifications.filter((n) => n.audience === 'customer')));
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  const types = Array.from(new Set(notifications.map((n) => n.type)));
  const groups = types
    .map((t) => ({ title: metaFor(t).label, type: t, data: notifications.filter((n) => n.type === t) }))
    .filter((g) => g.data.length > 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={() => markAllNotificationsRead('customer')}>
          <Text style={styles.markAll}>Mark all read</Text>
        </Pressable>
      </View>
      <SectionList
        sections={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24 }}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, !item.read && styles.cardUnread]} onPress={() => markNotificationRead(item.id)}>
            <View style={styles.iconWrap}>
              <Ionicons name={metaFor(item.type).icon} size={18} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            {!item.read ? <View style={styles.dot} /> : null}
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="No Notifications" message="You're all caught up. New updates will show up here." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.screenH, paddingTop: 12, paddingBottom: spacing.md },
  title: { ...type.pageTitle, color: colors.text },
  markAll: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
  sectionTitle: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary, marginTop: spacing.md, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.cardInner, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  cardUnread: { backgroundColor: colors.infoBg, borderColor: colors.secondary },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { ...type.cardTitle, fontSize: 14, color: colors.text },
  notifBody: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  notifTime: { ...type.supporting, color: colors.disabledText, marginTop: 4, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary, marginTop: 4 },
});
