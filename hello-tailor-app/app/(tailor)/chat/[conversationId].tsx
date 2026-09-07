// Tailor chat room. Mirrors the shape of the customer-side chat screen (not touched here) but
// wires the tailor-specific send path: a Progress Photo / Final Design attachment on a
// booking-linked conversation goes through uploadDesignForApproval (creates the "DESIGN
// PREVIEW — V{n}" approval card) instead of a plain attachment message.
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble, { DateSeparator, dateSeparatorLabel } from '@/components/chat/MessageBubble';
import MessageComposer from '@/components/chat/MessageComposer';
import AttachmentBottomSheet from '@/components/chat/AttachmentBottomSheet';
import ImageFullscreenViewer from '@/components/chat/ImageFullscreenViewer';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { ChatHistorySkeleton, ChatEmptyState } from '@/components/chat/ChatStates';
import EmptyState from '@/components/ui/EmptyState';
import { useConversationById, useMessages, useDesignVersionsFor, useIsTyping, simulateTypingPulse } from '@/store/chatStore';
import { sendMessage, retryMessage, markMessageRead } from '@/services/chatService';
import { ME_TAILOR_ID } from '@/data/seed';
import { colors, spacing } from '@/theme';

type ListRow = { key: string; kind: 'date'; label: string } | { key: string; kind: 'message'; messageId: string };

export default function TailorChatRoom() {
  const { conversationId, scrollToDesignVersionId } = useLocalSearchParams<{ conversationId: string; scrollToDesignVersionId?: string }>();
  const conversation = useConversationById(conversationId);
  const messages = useMessages(conversationId);
  const designVersions = useDesignVersionsFor(conversationId);
  const isCustomerTyping = useIsTyping(conversationId, 'customer');
  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  // Mark-as-read on mount only — never during render (see store/chatStore.ts header comment).
  useEffect(() => {
    markMessageRead(conversationId, 'tailor');
  }, [conversationId]);

  // Brief simulated fetch so a genuinely-empty new conversation shows a skeleton then an empty
  // state, instead of a skeleton stuck forever (messages.length === 0 was previously used as the
  // loading condition, which never resolves for an empty chat).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [conversationId]);

  // Step 21 — "Approval Required"/"Changes Requested" notifications deep-link with a target
  // design version; scroll to the message that carries it once the list has rendered.
  useEffect(() => {
    if (!scrollToDesignVersionId || loading) return;
    const target = messages.find((m) => m.designVersionId === scrollToDesignVersionId);
    if (!target) return;
    const index = buildRows(messages).findIndex((r) => r.kind === 'message' && r.messageId === target.id);
    if (index < 0) return;
    const t = setTimeout(() => {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToDesignVersionId, loading]);

  if (!conversation) {
    return (
      <View style={styles.container}>
        <ChatEmptyState role="tailor" />
      </View>
    );
  }

  const rows = buildRows(messages);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <ChatHeader conversation={conversation} viewerRole="tailor" />

      {loading ? (
        <ChatHistorySkeleton />
      ) : rows.length === 0 ? (
        <View style={styles.emptyFill}>
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No messages yet."
            message="Say hello or share what you'd like to know about this order."
          />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={rows}
          keyExtractor={(r) => r.key}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          onScrollToIndexFailed={() => {}}
          ListFooterComponent={isCustomerTyping ? <TypingIndicator /> : null}
          renderItem={({ item }) => {
            if (item.kind === 'date') return <DateSeparator label={item.label} />;
            const message = messages.find((m) => m.id === item.messageId)!;
            const designVersion = message.designVersionId
              ? designVersions.find((v) => v.id === message.designVersionId)
              : undefined;
            return (
              <MessageBubble
                message={message}
                viewerRole="tailor"
                isOwn={message.senderType === 'tailor'}
                designVersion={designVersion}
                onRetry={() => retryMessage(conversationId, message.id)}
                onImagePress={(uris, index) => setViewer({ images: uris, index })}
              />
            );
          }}
        />
      )}

      <MessageComposer
        onSendText={(text) => {
          sendMessage(conversationId, 'tailor', ME_TAILOR_ID, text);
          simulateTypingPulse(conversationId, 'customer');
        }}
        onAttachPress={() => setAttachSheetVisible(true)}
      />

      <AttachmentBottomSheet
        visible={attachSheetVisible}
        onClose={() => setAttachSheetVisible(false)}
        role="tailor"
        onPicked={(uri, suggestedType) => {
          router.push({
            pathname: '/(tailor)/chat/[conversationId]/preview',
            params: { conversationId, uri, suggestedType: suggestedType ?? '' },
          });
        }}
      />

      <ImageFullscreenViewer
        visible={!!viewer}
        images={viewer?.images ?? []}
        initialIndex={viewer?.index ?? 0}
        onClose={() => setViewer(null)}
      />
    </KeyboardAvoidingView>
  );
}

function buildRows(messages: ReturnType<typeof useMessages>): ListRow[] {
  const rows: ListRow[] = [];
  let lastDate = '';
  for (const m of messages) {
    const label = dateSeparatorLabel(m.createdAt);
    if (label !== lastDate) {
      rows.push({ key: `date-${m.id}`, kind: 'date', label });
      lastDate = label;
    }
    rows.push({ key: m.id, kind: 'message', messageId: m.id });
  }
  return rows;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyFill: { flex: 1, justifyContent: 'center' },
});
