import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, shadow } from '@/theme';

// Grid of stat tiles used across Dashboard/Analytics — flex-wrap so it reflows on narrow widths.
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export default function StatCard({
  label, value, icon, gold, trend,
}: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; gold?: boolean; trend?: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.iconWrap, gold && { backgroundColor: colors.goldLightBg }]}>
          <Ionicons name={icon} size={18} color={gold ? colors.gold : colors.ocean} />
        </View>
        {trend !== undefined && (
          <View style={[styles.trendPill, { backgroundColor: trend >= 0 ? '#E7F7EF' : '#FDEEEC' }]}>
            <Ionicons name={trend >= 0 ? 'arrow-up' : 'arrow-down'} size={10} color={trend >= 0 ? colors.success : colors.error} />
            <Text style={[styles.trendText, { color: trend >= 0 ? colors.success : colors.error }]}>{Math.abs(trend)}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: 190, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadow.card },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.pill },
  trendText: { fontFamily: font.bold, fontSize: 10 },
  value: { fontFamily: font.bold, fontSize: 21, color: colors.text },
  label: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
