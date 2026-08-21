import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useStore } from '@/store/useStore';

const LANGUAGES: { code: 'English' | 'Tamil'; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
];

export default function Language() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Language" subtitle={`Currently: ${language}`} />
      <View style={{ padding: spacing.screenH, gap: spacing.md }}>
        {LANGUAGES.map((l) => {
          const active = language === l.code;
          return (
            <Pressable key={l.code} style={[styles.row, active && styles.rowActive]} onPress={() => setLanguage(l.code)}>
              <View style={{ flex: 1, flexShrink: 1 }}>
                <Text style={styles.label} numberOfLines={2}>{l.label}</Text>
                <Text style={styles.native} numberOfLines={2}>{l.native}</Text>
              </View>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={colors.secondary} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.border, padding: spacing.cardInner, minHeight: 60 },
  rowActive: { borderColor: colors.secondary, backgroundColor: colors.infoBg },
  label: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.text, flexWrap: 'wrap' },
  native: { ...type.supporting, color: colors.textSecondary, marginTop: 2, flexWrap: 'wrap' },
});
