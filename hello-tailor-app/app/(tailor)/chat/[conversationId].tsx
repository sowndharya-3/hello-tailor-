// Tailor chat room. Mirrors the shape of the customer-side chat screen (not touched here) but
// wires the tailor-specific send path: a Progress Photo / Final Design attachment on a
// booking-linked conversation goes through uploadDesignForApproval (creates the "DESIGN
// PREVIEW — V{n}" approval card) instead of a plain attachment message.
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble, { DateSeparator, dateSeparatorLabel } from '@/components/chat/MessageBubble';
import MessageComposer from '@/components/chat/MessageComposer';
import AttachmentBottomSheet from '@/components/chat/AttachmentBottomSheet';
import ImageFullscreenViewer from '@/components/chat/ImageFullscreenViewer';
import { ChatHistorySkeleton, ChatEmptyState } from '@/components/chat/ChatStates';
import { useConversationById, useMessages, useDesignVersionsFor } from '@/store/chatStore';
import { sendMessage, markMessageRead } from '@/services/chatService';
import { ME_TAILOR_ID } from '@/data/seed';
import { colors, spacing } from '@/theme';

type ListRow = { key: string; kind: 'date'; label: string } | { key: string; kind: 'message'; messageId: string };

export default function TailorChatRoom() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const conversation = useConversationById(conversationId);
  const messages = useMessages(conversationId);
  const designVersions = useDesignVersionsFor(conversationId);
  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);

  // Mark-as-read on mount only — never during render (see store/chatStore.ts header comment).
  useEffect(() => {
    markMessageRead(conversationId, 'tailor');
  }, [conversationId]);

  if (!conversation) {
    return (
      <View style={styles.container}>
        <ChatEmptyState role="tailor" />
      </View>
    );
  }

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <ChatHeader conversation={conversation} viewerRole="tailor" />

      {messages.length === 0 ? (
        <ChatHistorySkeleton />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.key}
          contentContainerStyle={{ paddingVertical: spacing.md }}
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
                onImagePress={(uris, index) => setViewer({ images: uris, index })}
              />
            );
          }}
        />
      )}

      <MessageComposer
        onSendText={(text) => sendMessage(conversationId, 'tailor', ME_TAILOR_ID, text)}
        onAttachPress={() => setAttachSheetVisible(true)}
      />

      <AttachmentBottomSheet
        visible={attachSheetVisible}
        onClose={() => setAttachSheetVisible(false)}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
