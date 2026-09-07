// Phase 5 — dispatches each Message to the right visual: plain bubble for text, a centered pill
// for system messages ("Customer approved Design V1."), and the specialised cards for every
// attachment/design message type. Callers (the chat screen) never need an if/else over
// messageType themselves — one <MessageBubble message={m} .../> per list item covers everything.
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '@/theme';
import type { Message } from '@/store/chatTypes';
import MessageStatus from './MessageStatus';
import PhotoAttachmentCard from './PhotoAttachmentCard';
import DesignApprovalCard from './DesignApprovalCard';
import ChangeRequestCard from './ChangeRequestCard';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({
  message,
  viewerRole,
  isOwn,
  designVersion,
  onRetry,
  onImagePress,
  onApproveDesign,
  onRequestChanges,
}: {
  message: Message;
  viewerRole: 'customer' | 'tailor';
  isOwn: boolean;
  designVersion?: import('@/store/chatTypes').DesignVersion;
  onRetry?: () => void;
  onImagePress?: (uris: string[], index: number) => void;
  onApproveDesign?: () => void;
  onRequestChanges?: () => void;
}) {
  if (message.messageType === 'system') {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  if (message.messageType === 'design_approval' && designVersion) {
    return (
      <View style={[styles.cardRow, isOwn && styles.cardRowRight]}>
        <DesignApprovalCard
          version={designVersion}
          viewerRole={viewerRole}
          onApprove={onApproveDesign}
          onRequestChanges={onRequestChanges}
          onImagePress={() => onImagePress?.([designVersion.imageUrl], 0)}
        />
      </View>
    );
  }

  if (message.messageType === 'change_request' && designVersion) {
    return (
      <View style={[styles.cardRow, isOwn && styles.cardRowRight]}>
        <ChangeRequestCard
          version={designVersion}
          onImagePress={() => onImagePress?.([designVersion.changeReferenceImageUrl ?? ''], 0)}
        />
      </View>
    );
  }

  if (message.attachments?.length) {
    const attachment = message.attachments[0];
    return (
      <View style={[styles.cardRow, isOwn && styles.cardRowRight]}>
        <PhotoAttachmentCard
          attachment={attachment}
          caption={message.caption}
          timestamp={message.createdAt}
          align={isOwn ? 'right' : 'left'}
          onPress={() => onImagePress?.([attachment.fileUrl], 0)}
        />
      </View>
    );
  }

  // Plain text bubble.
  return (
    <View style={[styles.row, isOwn && styles.rowRight]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn && styles.textOwn]}>{message.text}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.time, isOwn && styles.timeOwn]}>{formatTime(message.createdAt)}</Text>
          {isOwn ? <MessageStatus status={message.status} size={13} /> : null}
        </View>
        {message.status === 'failed' && isOwn ? (
          <Text onPress={onRetry} style={styles.retry}>
            Retry
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// Phase 5 — "Today" / "Yesterday" / "04 Sep 2026" date separators between message groups.
export function dateSeparatorLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function DateSeparator({ label }: { label: string }) {
  return (
    <View style={styles.dateSepWrap}>
      <Text style={styles.dateSepText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.screenH, marginBottom: 4 },
  rowRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  bubbleOther: { backgroundColor: colors.white, borderBottomLeftRadius: 4 },
  bubbleOwn: { backgroundColor: colors.secondary, borderBottomRightRadius: 4 },
  text: { fontFamily: font.regular, fontSize: 14.5, color: colors.text, lineHeight: 20 },
  textOwn: { color: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginTop: 4 },
  time: { fontFamily: font.regular, fontSize: 10, color: colors.textSecondary },
  timeOwn: { color: 'rgba(255,255,255,0.8)' },
  retry: { fontFamily: font.semibold, fontSize: 11, color: colors.error, marginTop: 4, alignSelf: 'flex-end' },
  cardRow: { paddingHorizontal: spacing.screenH, marginBottom: 4, alignItems: 'flex-start' },
  cardRowRight: { alignItems: 'flex-end' },
  systemWrap: { alignSelf: 'center', backgroundColor: colors.disabledBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginVertical: 8 },
  systemText: { fontFamily: font.medium, fontSize: 11.5, color: colors.textSecondary },
  dateSepWrap: { alignSelf: 'center', backgroundColor: '#EDEFF3', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginVertical: 10 },
  dateSepText: { fontFamily: font.medium, fontSize: 11, color: colors.textSecondary },
});
