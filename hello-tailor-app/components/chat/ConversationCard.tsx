// Phase 2/3 — one card per role, driven by a `viewerRole` prop rather than two components,
// since the fields differ by one line (tailor shows customer identity + service, customer shows
// tailor identity + shop name) and duplicating the layout would just be two copies to keep in
// sync.
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import UnreadBadge from './UnreadBadge';
import { colors, font, radius, spacing } from '@/theme';
import type { Conversation } from '@/store/chatTypes';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function previewFor(c: Conversation) {
  if (c.lastMessageType === 'reference_design') return '📎 Reference design sent';
  if (c.lastMessageType === 'cloth_photo') return '📎 Cloth photo sent';
  if (c.lastMessageType === 'measurement_reference') return '📎 Measurement reference sent';
  if (c.lastMessageType === 'progress_photo') return '📎 Progress photo sent';
  if (c.lastMessageType === 'design_approval') return '🧵 Design shared for approval';
  if (c.lastMessageType === 'change_request') return '✏️ Requested design changes';
  return c.lastMessage || 'Say hello 👋';
}

export default function ConversationCard({
  conversation,
  viewerRole,
  onPress,
}: {
  conversation: Conversation;
  viewerRole: 'customer' | 'tailor';
  onPress: () => void;
}) {
  const unread = viewerRole === 'customer' ? conversation.unreadCountCustomer : conversation.unreadCountTailor;
  const title = viewerRole === 'customer' ? conversation.tailorName : conversation.customerName;
  const subtitle = viewerRole === 'customer' ? conversation.tailorShopName : conversation.bookingCategory;
  const avatar = viewerRole === 'customer' ? conversation.tailorAvatar : conversation.customerAvatar;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.bg }]}>
      <Avatar uri={avatar} name={title} size={52} />
      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.name} numberOfLines={1}>{title}</Text>
          <Text style={styles.time}>{timeAgo(conversation.lastMessageAt)}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        {conversation.bookingId ? <Text style={styles.bookingId}>Booking #{conversation.bookingId}</Text> : null}
        <View style={styles.topLine}>
          <Text style={[styles.preview, unread > 0 && styles.previewUnread]} numberOfLines={1}>
            {previewFor(conversation)}
          </Text>
          <UnreadBadge count={unread} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.screenH, paddingVertical: spacing.md, alignItems: 'flex-start' },
  body: { flex: 1, minWidth: 0 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  name: { fontFamily: font.semibold, fontSize: 15, color: colors.text, flexShrink: 1 },
  time: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary },
  subtitle: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  bookingId: { fontFamily: font.medium, fontSize: 11, color: colors.secondary, marginTop: 2 },
  preview: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, flex: 1, marginTop: 3 },
  previewUnread: { color: colors.text, fontFamily: font.medium },
});

export const CARD_RADIUS = radius.card;
