import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { colors, font, radii, spacing } from '@/theme';

export function ReasonSheet({
  visible, onClose, onConfirm, title, reasons, confirmLabel, confirmMessage,
}: {
  visible: boolean; onClose: () => void; onConfirm: (reason: string, note: string) => void;
  title: string; reasons: string[]; confirmLabel: string; confirmMessage: string;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const submit = () => {
    if (!reason) return;
    Alert.alert(confirmLabel, confirmMessage, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: confirmLabel, style: 'destructive', onPress: () => {
          onConfirm(reason, note);
          setReason(null);
          setNote('');
        },
      },
    ]);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      {reasons.map((r) => {
        const active = reason === r;
        return (
          <Pressable key={r} style={[styles.reasonRow, active && styles.reasonRowActive]} onPress={() => setReason(r)}>
            <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? colors.ocean : colors.border} />
            <Text style={[styles.reasonText, active && styles.reasonTextActive]}>{r}</Text>
          </Pressable>
        );
      })}
      <TextInput
        style={styles.notesInput}
        placeholder="Add a note for the customer (optional)"
        placeholderTextColor={colors.textSecondary}
        value={note}
        onChangeText={setNote}
        multiline
      />
      <Button label={confirmLabel} onPress={submit} variant="destructive" disabled={!reason} style={{ marginTop: spacing.lg }} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: radii.input, marginBottom: 4 },
  reasonRowActive: { backgroundColor: colors.infoBg },
  reasonText: { fontFamily: font.regular, fontSize: 14, color: colors.textPrimary, marginLeft: 10, flex: 1 },
  reasonTextActive: { fontFamily: font.semibold, color: colors.ocean },
  notesInput: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.input, padding: 12, minHeight: 70,
    fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginTop: spacing.md, textAlignVertical: 'top',
  },
});
