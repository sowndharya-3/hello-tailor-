// Phase 6 — bottom composer. The screen that renders this must itself be wrapped in
// KeyboardAvoidingView (behavior="padding" on iOS, "height" on Android — same pattern already
// used in app/(auth)/login.tsx) so the keyboard never covers this row; this component only
// renders the row itself, it doesn't own keyboard-avoidance (that has to wrap the whole screen,
// message list included, or the list won't resize either).
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';

export default function MessageComposer({
  onSendText,
  onAttachPress,
}: {
  onSendText: (text: string) => void;
  onAttachPress: () => void;
}) {
  const [text, setText] = useState('');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendText(trimmed);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onAttachPress} hitSlop={10} style={styles.iconBtn}>
        <Ionicons name="add-circle" size={30} color={colors.secondary} />
      </Pressable>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={colors.disabledText}
        style={styles.input}
        multiline
      />
      <Pressable onPress={send} hitSlop={10} disabled={!text.trim()} style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}>
        <Ionicons name="send" size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconBtn: { paddingBottom: 6 },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 42,
    borderRadius: radius.input,
    backgroundColor: colors.bg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: font.regular,
    fontSize: 14.5,
    color: colors.text,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.disabledBg },
});
