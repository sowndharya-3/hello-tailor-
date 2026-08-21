import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, type } from '@/theme';

export default function Section({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: spacing.section }}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.md,
  },
  title: { ...type.sectionHeading, color: colors.text },
  action: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});

