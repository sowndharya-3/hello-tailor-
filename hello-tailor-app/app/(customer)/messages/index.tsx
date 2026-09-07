// Customer "Messages" tab (Phase 1-3, 9-11). Header: HT logo + title + search icon that reveals
// a search field filtering by tailor/shop name; All/Unread segmented filter; ConversationCard list.
// getConversations() is called once on mount to simulate the initial fetch (skeleton shown while
// pending) but the list itself renders off useConversations() so it stays reactive to store
// updates (new messages, etc) without a second read.
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import SegmentedControl from '@/components/ui/SegmentedControl';
import ConversationCard from '@/components/chat/ConversationCard';
import { ChatListSkeleton, ChatEmptyState } from '@/components/chat/ChatStates';
import { useConversations } from '@/store/chatStore';
import { getConversations } from '@/services/chatService';
import { buildNotificationCopy, handleNotificationTap } from '@/services/pushNotifications';

const TABS = ['All', 'Unread'] as const;

export default function MessagesTab() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
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
    .filter((c) => (tab === 'Unread' ? c.unreadCountCustomer > 0 : true))
    .filter((c) => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return c.tailorName.toLowerCase().includes(q) || (c.tailorShopName ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Image source={require('../../../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Messages</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => {
            setSearchOpen((v) => !v);
            if (searchOpen) setQuery('');
          }}
        >
          <Ionicons name={searchOpen ? 'close' : 'search'} size={20} color={colors.text} />
        </Pressable>
      </View>

      {searchOpen ? (
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by tailor or shop name..."
            placeholderTextColor={colors.disabledText}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      ) : null}

      <View style={{ paddingHorizontal: spacing.screenH, marginBottom: spacing.md }}>
        <SegmentedControl options={[...TABS]} value={tab} onChange={(v) => setTab(v as (typeof TABS)[number])} />
      </View>

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
              viewerRole="customer"
              onPress={() => router.push({ pathname: '/(customer)/chat/[conversationId]', params: { conversationId: item.id } })}
            />
          )}
          ListEmptyComponent={<ChatEmptyState role="customer" />}
        />
      )}

      {/* ponytail: no real FCM in this prototype (see services/pushNotifications.ts header) — this
          dev-only affordance proves handleNotificationTap's deep-link actually works end to end
          without building a full "notifications received" simulation UI, which the brief says is
          fine to skip under time pressure. Remove once real push notifications land. */}
      {!loading && conversations[0] ? (
        <Pressable
          style={styles.simulateBtn}
          onPress={() => {
            const conv = conversations[0];
            const copy = buildNotificationCopy('new_message', { otherPartyName: conv.tailorName, bookingId: conv.bookingId });
            handleNotificationTap({ type: 'new_message', conversationId: conv.id, bookingId: conv.bookingId, title: copy.title, body: copy.body }, 'customer');
          }}
        >
          <Ionicons name="notifications-outline" size={14} color={colors.secondary} />
          <Text style={styles.simulateText}>Simulate incoming notification</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.screenH, paddingTop: 8, paddingBottom: 10, gap: 10 },
  logo: { width: 32, height: 32 },
  title: { flex: 1, fontFamily: font.semibold, fontSize: 20, color: colors.text },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: spacing.screenH, marginBottom: spacing.md,
    height: 44, borderRadius: 12, paddingHorizontal: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.text },
  simulateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  simulateText: { fontFamily: font.medium, fontSize: 11.5, color: colors.secondary },
});
