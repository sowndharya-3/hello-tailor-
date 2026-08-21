import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '../../constants/theme';

type Tone = 'success' | 'error' | 'warning' | 'info' | 'gold' | 'neutral' | 'navy';

const toneMap: Record<Tone, { bg: string; fg: string; icon?: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: '#E7F7EF', fg: colors.success, icon: 'checkmark-circle' },
  error: { bg: '#FDEEEC', fg: colors.error, icon: 'close-circle' },
  warning: { bg: '#FEF3E4', fg: colors.warning, icon: 'alert-circle' },
  info: { bg: colors.infoBg, fg: colors.secondary, icon: 'information-circle' },
  gold: { bg: colors.goldLightBg, fg: colors.gold, icon: 'star' },
  neutral: { bg: colors.disabledBg, fg: colors.textSecondary },
  navy: { bg: '#E7EDF2', fg: colors.primary },
};

export default function Badge({ label, tone = 'neutral', withIcon = true }: { label: string; tone?: Tone; withIcon?: boolean }) {
  const t = toneMap[tone];
  return (
    <View style={[styles.wrap, { backgroundColor: t.bg }]}>
      {withIcon && t.icon ? <Ionicons name={t.icon} size={12} color={t.fg} /> : null}
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { ...type.supporting, fontFamily: 'Inter_500Medium' },
});
