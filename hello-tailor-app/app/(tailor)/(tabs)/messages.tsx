// Tailor "Messages" tab. Same fetch-once/skeleton/empty pattern as the customer side's
// messages/index.tsx, but the filter row needs 6 options (All/Unread/+4 bookingChatStatus
// values) so it's a horizontal chip row instead of SegmentedControl (that component's flex
// layout only reads well with 2-3 options — see components/ui/SegmentedControl.tsx), styled
// like the photo-type chips in components/chat/ImagePreview.tsx which is this app's existing
// chip visual language.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import ConversationCard from '@/components/chat/ConversationCard';
import { ChatListSkeleton, ChatEmptyState, ChatErrorState } from '@/components/chat/ChatStates';
import { useConversations, useChatStore } from '@/store/chatStore';
import { getConversations } from '@/services/chatService';
import { buildNotificationCopy, handleNotificationTap } from '@/services/pushNotifications';
import type { BookingChatStatus } from '@/store/chatTypes';
import { colors, font, spacing } from '@/theme';

const FILTERS = ['All', 'Unread', 'Active Orders', 'Awaiting Approval', 'Changes Requested', 'Completed'] as const;
type Filter = (typeof FILTERS)[number];

export default function MessagesTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>('All');
  const conversations = useConversations();
  const changesRequestedVersion = useChatStore((s) => s.designVersions.find((v) => v.status === 'changes_requested'));

  const fetchConversations = () => {
    setLoading(true);
    setError(false);
    getConversations()
      .then(() => setLoading(false))
      .catch(() => {
        // Unreachable with the current mock service — kept so this screen is already correct
        // for when a real backend call can fail.
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    fetchConversations();
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
      ) : error ? (
        <ChatErrorState onRetry={fetchConversations} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              viewerRole="tailor"
              onPress={() => router.push({ pathname: '/(tailor)/chat/[conversationId]', params: { conversationId: item.id } })}
            />
          )}
          ListEmptyComponent={
            <ChatEmptyState role="tailor" variant={filter === 'All' ? 'none' : filter === 'Unread' ? 'unread' : 'filter'} />
          }
        />
      )}

      {/* ponytail: demo affordance proving the "Changes Requested" tailor-facing deep-link
          actually opens the right conversation + design context — see the matching customer-side
          simulate row in (customer)/messages/index.tsx. Remove once real push lands. */}
      {!loading && !error && changesRequestedVersion ? (
        <Pressable
          style={styles.simulateBtn}
          onPress={() => {
            const conv = conversations.find((c) => c.id === changesRequestedVersion.conversationId);
            if (!conv) return;
            const copy = buildNotificationCopy('changes_requested', { otherPartyName: conv.customerName, bookingId: conv.bookingId, designVersion: changesRequestedVersion.version });
            handleNotificationTap(
              { type: 'changes_requested', conversationId: conv.id, bookingId: conv.bookingId, designVersionId: changesRequestedVersion.id, title: copy.title, body: copy.body },
              'tailor',
            );
          }}
        >
          <Ionicons name="notifications-outline" size={14} color={colors.secondary} />
          <Text style={styles.simulateText}>Simulate: Changes Requested</Text>
        </Pressable>
      ) : null}
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
  simulateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  simulateText: { fontFamily: font.medium, fontSize: 11.5, color: colors.secondary },
});
