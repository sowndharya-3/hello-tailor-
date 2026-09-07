// Phase 29/30/31 — ChatSkeleton / ChatEmptyState / ChatErrorState, built on the app's existing
// generic Skeleton/EmptyState/ErrorState primitives so they match the rest of the app instead of
// introducing a second visual language for loading/empty/error moments.
import { View, StyleSheet } from 'react-native';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { SkeletonBlock } from '@/components/ui/Skeleton';
import { spacing } from '@/theme';

export function ChatListSkeleton() {
  return (
    <View style={{ paddingTop: spacing.md }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.row}>
          <SkeletonBlock style={{ width: 52, height: 52, borderRadius: 26 }} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBlock style={{ width: '55%', height: 13 }} />
            <SkeletonBlock style={{ width: '80%', height: 12 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ChatHistorySkeleton() {
  return (
    <View style={{ padding: spacing.lg, gap: spacing.md }}>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonBlock
          key={i}
          style={{ width: i % 2 === 0 ? '65%' : '50%', height: 40, borderRadius: 16, alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end' }}
        />
      ))}
    </View>
  );
}

export function DesignCardSkeleton() {
  return (
    <View style={{ padding: spacing.md }}>
      <SkeletonBlock style={{ width: '100%', height: 220, borderRadius: 16 }} />
      <SkeletonBlock style={{ width: '60%', height: 14, marginTop: 10 }} />
    </View>
  );
}

// `variant` covers the distinct empty states a Messages list can be in (Step 5/6/16) — plain
// "no conversations yet" reads as broken when what's actually true is "no unread" or "no match
// for your search/filter", so each gets its own copy instead of one generic message everywhere.
export function ChatEmptyState({
  role,
  variant = 'none',
  query,
}: {
  role: 'customer' | 'tailor';
  variant?: 'none' | 'unread' | 'search' | 'filter';
  query?: string;
}) {
  if (variant === 'search') {
    return <EmptyState icon="search-outline" title="No results found" message={query ? `No conversations match "${query}".` : 'Try a different search.'} />;
  }
  if (variant === 'unread') {
    return <EmptyState icon="checkmark-done-circle-outline" title="You're all caught up" message="No unread conversations right now." />;
  }
  if (variant === 'filter') {
    return <EmptyState icon="filter-outline" title="No conversations here" message="Nothing matches this filter yet." />;
  }
  return role === 'customer' ? (
    <EmptyState icon="chatbubbles-outline" title="No messages yet." message="Start a conversation with your tailor." />
  ) : (
    <EmptyState icon="chatbubbles-outline" title="No customer messages yet." message="Conversations with customers will show up here." />
  );
}

export function ChatErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon="cloud-offline-outline"
      title="Couldn't load messages"
      message="Check your internet connection and try again."
      onPress={onRetry}
    />
  );
}

export function MessageFailedErrorState({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState icon="alert-circle-outline" title="Message failed to send" message="Tap retry to send it again." ctaLabel="Retry" onPress={onRetry} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.screenH, paddingVertical: spacing.md },
});
