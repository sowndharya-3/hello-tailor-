import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';

export default function PageHeader({ title, description, right }: { title: string; description?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' },
  title: { fontFamily: font.bold, fontSize: 22, color: colors.navy },
  desc: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
