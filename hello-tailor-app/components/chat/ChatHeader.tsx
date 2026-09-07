// Phase 4 — chat room header. Shows exactly who this conversation is with (never anonymous/
// group) plus the booking context when one is attached.
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Avatar from '@/components/ui/Avatar';
import { colors, font, spacing } from '@/theme';
import type { Conversation } from '@/store/chatTypes';

export default function ChatHeader({
  conversation,
  viewerRole,
  onMorePress,
}: {
  conversation: Conversation;
  viewerRole: 'customer' | 'tailor';
  onMorePress?: () => void;
}) {
  const name = viewerRole === 'customer' ? conversation.tailorShopName || conversation.tailorName : conversation.customerName;
  const avatar = viewerRole === 'customer' ? conversation.tailorAvatar : conversation.customerAvatar;
  const online = viewerRole === 'customer'; // demo: tailor shown online to customer, kept simple

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={26} color={colors.white} />
      </Pressable>
      <Avatar uri={avatar} name={name} size={38} />
      <View style={styles.center}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {conversation.bookingId ? (
          <Text style={styles.sub} numberOfLines={1}>
            Booking #{conversation.bookingId}
            {conversation.bookingCategory ? ` • ${conversation.bookingCategory}` : ''}
          </Text>
        ) : (
          <Text style={styles.sub}>{online ? 'Online' : 'Offline'}</Text>
        )}
      </View>
      {onMorePress ? (
        <Pressable onPress={onMorePress} hitSlop={10} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingTop: 54,
    paddingBottom: spacing.md,
  },
  iconBtn: { padding: 2 },
  center: { flex: 1, minWidth: 0 },
  name: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
  sub: { fontFamily: font.regular, fontSize: 11.5, color: '#C9D8E3', marginTop: 1 },
});
