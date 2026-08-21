import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '../constants/theme';

export default function NavCard({
  icon,
  label,
  sub,
  onPress,
  tone = 'default',
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
  tone?: 'default' | 'gold' | 'destructive';
  badge?: string;
}) {
  const iconBg = tone === 'gold' ? colors.goldLightBg : tone === 'destructive' ? '#FDEEEC' : colors.infoBg;
  const iconColor = tone === 'gold' ? colors.gold : tone === 'destructive' ? colors.error : colors.secondary;
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, tone === 'destructive' && { color: colors.error }]}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 38, height: 38, borderRadius: radius.input, alignItems: 'center', justifyContent: 'center' },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 1 },
  badge: { backgroundColor: colors.gold, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  badgeText: { ...type.supporting, fontSize: 10, color: colors.white, fontFamily: 'Inter_600SemiBold' },
});
