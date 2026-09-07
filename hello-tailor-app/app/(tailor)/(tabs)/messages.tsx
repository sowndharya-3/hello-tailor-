// Tailor "Messages" tab. Same fetch-once/skeleton/empty pattern as the customer side's
// messages/index.tsx, but the filter row needs 6 options (All/Unread/+4 bookingChatStatus
// values) so it's a horizontal chip row instead of SegmentedControl (that component's flex
// layout only reads well with 2-3 options — see components/ui/SegmentedControl.tsx), styled
// like the photo-type chips in components/chat/ImagePreview.tsx which is this app's existing
// chip visual language.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import ConversationCard from '@/components/chat/ConversationCard';
import { ChatListSkeleton, ChatEmptyState } from '@/components/chat/ChatStates';
import { useConversations } from '@/store/chatStore';
import { getConversations } from '@/services/chatService';
import type { BookingChatStatus } from '@/store/chatTypes';
import { colors, font, spacing } from '@/theme';

const FILTERS = ['All', 'Unread', 'Active Orders', 'Awaiting Approval', 'Changes Requested', 'Completed'] as const;
type Filter = (typeof FILTERS)[number];

export default function MessagesTab() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');
  const conversations = useConversations();

  useEffect(() => {
    let active = true;
    getConversations().then(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = conversations
    .filter((c) => {
      if (filter === 'All') return true;
      if (filter === 'Unread') return c.unreadCountTailor > 0;
      return c.bookingChatStatus === (filter as BookingChatStatus);
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipRowContent}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <ChatListSkeleton />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              viewerRole="tailor"
              onPress={() => router.push({ pathname: '/(tailor)/chat/[conversationId]', params: { conversationId: item.id } })}
            />
          )}
          ListEmptyComponent={<ChatEmptyState role="tailor" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  chipRow: { flexGrow: 0, marginBottom: spacing.sm },
  chipRowContent: { paddingHorizontal: spacing.lg, gap: 8, paddingBottom: spacing.sm },
  chip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontFamily: font.medium, fontSize: 12.5, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
});
