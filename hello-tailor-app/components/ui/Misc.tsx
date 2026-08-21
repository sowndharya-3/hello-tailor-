import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radii, spacing } from '@/theme';
// ponytail: EmptyState/ErrorState/Skeleton/StarRating/ScreenHeader/SegmentedControl already
// exist as default exports in their own files (ported from customer-app) — not duplicated here.

// ---------- StatusPill ----------
type PillTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold';

export function StatusPill({ label, tone = 'neutral', icon }: { label: string; tone?: PillTone; icon?: keyof typeof Ionicons.glyphMap }) {
  const map: Record<PillTone, { bg: string; fg: string }> = {
    success: { bg: '#E7F7EF', fg: colors.success },
    warning: { bg: '#FFF4E5', fg: colors.warning },
    error: { bg: '#FDECEA', fg: colors.error },
    info: { bg: colors.infoBg, fg: colors.ocean },
    neutral: { bg: colors.disabledBg, fg: colors.textSecondary },
    gold: { bg: colors.goldLightBg, fg: '#9C7523' },
  };
  const c = map[tone];
  return (
    <View style={[pillStyles.pill, { backgroundColor: c.bg }]}>
      {icon && <Ionicons name={icon} size={12} color={c.fg} style={{ marginRight: 4 }} />}
      <Text style={[pillStyles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}
const pillStyles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill, alignSelf: 'flex-start' },
  text: { fontFamily: font.semibold, fontSize: 12 },
});

// ---------- MetricCard ----------
export function MetricCard({ label, value, icon, tone = 'ocean', onPress }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; tone?: 'ocean' | 'gold' | 'success' | 'navy'; onPress?: () => void }) {
  const toneColor = { ocean: colors.ocean, gold: colors.gold, success: colors.success, navy: colors.navy }[tone];
  return (
    <Pressable onPress={onPress} style={metricStyles.card}>
      <View style={[metricStyles.iconWrap, { backgroundColor: toneColor + '1A' }]}>
        <Ionicons name={icon} size={18} color={toneColor} />
      </View>
      <Text style={metricStyles.value}>{value}</Text>
      <Text style={metricStyles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}
const metricStyles = StyleSheet.create({
  card: { width: '48%', backgroundColor: colors.white, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  value: { fontFamily: font.bold, fontSize: 20, color: colors.textPrimary },
  label: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});

// ---------- StepProgress ----------
export function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontFamily: font.medium, fontSize: 12, color: colors.textSecondary }}>Step {step} of {total}</Text>
        <Text style={{ fontFamily: font.semibold, fontSize: 12, color: colors.ocean }}>{label}</Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.disabledBg, overflow: 'hidden' }}>
        <View style={{ height: 6, width: `${(step / total) * 100}%`, backgroundColor: colors.ocean, borderRadius: 3 }} />
      </View>
    </View>
  );
}

// ---------- Chip ----------
export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable onPress={onPress} style={[chipStyles.chip, selected && chipStyles.chipActive]}>
      {icon && <Ionicons name={icon} size={14} color={selected ? colors.white : colors.textSecondary} style={{ marginRight: 6 }} />}
      <Text style={[chipStyles.text, selected && chipStyles.textActive]}>{label}</Text>
      {selected && <Ionicons name="checkmark" size={14} color={colors.white} style={{ marginLeft: 6 }} />}
    </Pressable>
  );
}
const chipStyles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: radii.pill, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.ocean, borderColor: colors.ocean },
  text: { fontFamily: font.medium, fontSize: 13, color: colors.textPrimary },
  textActive: { color: colors.white },
});
