// Customer chat room (Phase 4-6, 12-16). Header + message history grouped by day + composer.
// Design-approval cards live inline in the message list via MessageBubble; "Request Changes"
// opens the bottom sheet built here (categories + instructions + optional reference photo).
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble, { DateSeparator, dateSeparatorLabel } from '@/components/chat/MessageBubble';
import MessageComposer from '@/components/chat/MessageComposer';
import AttachmentBottomSheet from '@/components/chat/AttachmentBottomSheet';
import ImageFullscreenViewer from '@/components/chat/ImageFullscreenViewer';
import TypingIndicator from '@/components/chat/TypingIndicator';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import { ChatEmptyState } from '@/components/chat/ChatStates';
import { useConversationById, useMessages, useDesignVersionsFor, useIsTyping } from '@/store/chatStore';
import { sendMessage, retryMessage, markMessageRead, approveDesign, requestDesignChanges } from '@/services/chatService';
import { CHANGE_REQUEST_OPTIONS, type ChangeRequestOption, type Message, type PhotoType } from '@/store/chatTypes';

export default function ChatRoom() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const conversation = useConversationById(conversationId);
  const messages = useMessages(conversationId);
  const designVersions = useDesignVersionsFor(conversationId);
  const isTailorTyping = useIsTyping(conversationId, 'tailor');
  const listRef = useRef<FlatList>(null);

  const [attachSheetOpen, setAttachSheetOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<{ images: string[]; index: number } | null>(null);
  const [changeRequestFor, setChangeRequestFor] = useState<string | null>(null); // designVersionId

  // Mark-as-read once per conversation mount/id-change only — never during render (see
  // store/chatStore.ts header comment on the "Maximum update depth exceeded" bug class).
  useEffect(() => {
    markMessageRead(conversationId, 'customer');
  }, [conversationId]);

  const items = useMemo(() => {
    const out: Array<{ key: string; type: 'date'; label: string } | { key: string; type: 'msg'; message: Message }> = [];
    let lastDay = '';
    for (const m of messages) {
      const day = new Date(m.createdAt).toDateString();
      if (day !== lastDay) {
        out.push({ key: `date-${m.id}`, type: 'date', label: dateSeparatorLabel(m.createdAt) });
        lastDay = day;
      }
      out.push({ key: m.id, type: 'msg', message: m });
    }
    return out;
  }, [messages]);

  if (!conversation) {
    return (
      <View style={styles.wrap}>
        <ChatEmptyState role="customer" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ChatHeader conversation={conversation} viewerRole="customer" />

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingVertical: spacing.md, flexGrow: 1 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={isTailorTyping ? <TypingIndicator /> : null}
        renderItem={({ item }) =>
          item.type === 'date' ? (
            <DateSeparator label={item.label} />
          ) : (
            <MessageBubble
              message={item.message}
              viewerRole="customer"
              isOwn={item.message.senderType === 'customer'}
              designVersion={designVersions.find((v) => v.id === item.message.designVersionId)}
              onRetry={() => retryMessage(conversationId, item.message.id)}
              onImagePress={(uris, index) => setViewerImages({ images: uris, index })}
              onApproveDesign={item.message.designVersionId ? () => approveDesign(item.message.designVersionId!) : undefined}
              onRequestChanges={item.message.designVersionId ? () => setChangeRequestFor(item.message.designVersionId!) : undefined}
            />
          )
        }
      />

      <MessageComposer
        onSendText={(text) => sendMessage(conversationId, 'customer', 'me', text)}
        onAttachPress={() => setAttachSheetOpen(true)}
      />

      <AttachmentBottomSheet
        visible={attachSheetOpen}
        onClose={() => setAttachSheetOpen(false)}
        onPicked={(uri, suggestedType) =>
          router.push({
            pathname: '/(customer)/chat/[conversationId]/preview',
            params: { conversationId, uri, suggestedType: suggestedType ?? '' },
          })
        }
      />

      <ImageFullscreenViewer
        visible={!!viewerImages}
        images={viewerImages?.images ?? []}
        initialIndex={viewerImages?.index ?? 0}
        onClose={() => setViewerImages(null)}
      />

      <ChangeRequestSheet
        visible={!!changeRequestFor}
        onClose={() => setChangeRequestFor(null)}
        onSubmit={(categories, instructions, referenceImageUri) => {
          if (!changeRequestFor) return;
          requestDesignChanges(changeRequestFor, categories, instructions, referenceImageUri);
          setChangeRequestFor(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}

// Phase 14 — "What needs to be changed?" sheet, opened from a pending design-approval card.
function ChangeRequestSheet({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (categories: ChangeRequestOption[], instructions: string, referenceImageUri?: string) => void;
}) {
  const [selected, setSelected] = useState<ChangeRequestOption[]>([]);
  const [instructions, setInstructions] = useState('');
  const [referenceUri, setReferenceUri] = useState<string | undefined>(undefined);

  const toggle = (opt: ChangeRequestOption) => {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const pickReference = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets?.[0]?.uri) setReferenceUri(result.assets[0].uri);
  };

  const reset = () => {
    setSelected([]);
    setInstructions('');
    setReferenceUri(undefined);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={() => {
        reset();
        onClose();
      }}
      title="What needs to be changed?"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chipsRow}>
          {CHANGE_REQUEST_OPTIONS.map((opt) => {
            const active = selected.includes(opt);
            return (
              <Pressable key={opt} onPress={() => toggle(opt)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Additional Instructions</Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Describe what you'd like changed..."
          placeholderTextColor={colors.disabledText}
          style={styles.instructionsInput}
          multiline
        />

        <Pressable style={styles.uploadRow} onPress={pickReference}>
          <Ionicons name={referenceUri ? 'checkmark-circle' : 'camera-outline'} size={18} color={colors.secondary} />
          <Text style={styles.uploadText}>{referenceUri ? 'Reference photo attached' : 'Upload Reference Photo'}</Text>
        </Pressable>

        <Button
          label="Send Change Request"
          disabled={selected.length === 0}
          onPress={() => {
            onSubmit(selected, instructions.trim(), referenceUri);
            reset();
          }}
          style={{ marginTop: spacing.md, marginBottom: spacing.sm }}
        />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontFamily: font.medium, fontSize: 12.5, color: colors.text },
  chipTextActive: { color: colors.white },
  label: { fontFamily: font.medium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 8 },
  instructionsInput: {
    minHeight: 80, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 10,
    fontFamily: font.regular, fontSize: 14, color: colors.text, marginBottom: spacing.md,
  },
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  uploadText: { fontFamily: font.medium, fontSize: 13, color: colors.secondary },
});
