import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, type } from '@/theme';
import BottomSheet from './BottomSheet';
import Button from './Button';

// Confirm/cancel dialog for destructive or status-changing admin actions.
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onCancel} title={title}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.row}>
        <Button label="Cancel" variant="outline" onPress={onCancel} style={{ flex: 1 }} />
        <Button
          label={confirmLabel}
          variant={destructive ? 'destructive' : 'primary'}
          onPress={onConfirm}
          style={{ flex: 1 }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  message: { ...type.body, color: colors.textSecondary, marginBottom: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
});
