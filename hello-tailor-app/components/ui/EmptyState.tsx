import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type } from '@/theme';
import Button from './Button';

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  ctaLabel,
  onPress,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  ctaLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={colors.secondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {ctaLabel ? <Button label={ctaLabel} onPress={onPress} style={{ marginTop: spacing.lg, minWidth: 180 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...type.cardTitle, color: colors.text, marginBottom: 6, textAlign: 'center' },
  message: { ...type.body, color: colors.textSecondary, textAlign: 'center' },
});

