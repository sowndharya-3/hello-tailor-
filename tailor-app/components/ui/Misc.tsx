import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radii, spacing } from '@/theme';
import { Button } from './Button';

// ---------- StatusPill / Badge ----------
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

// ---------- SegmentedControl ----------
export function SegmentedControl({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={segStyles.wrap}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable key={opt} onPress={() => onChange(opt)} style={[segStyles.item, active && segStyles.itemActive]}>
            <Text style={[segStyles.text, active && segStyles.textActive]} numberOfLines={1}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const segStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.disabledBg, borderRadius: radii.pill, padding: 4 },
  item: { flex: 1, paddingVertical: 9, borderRadius: radii.pill, alignItems: 'center' },
  itemActive: { backgroundColor: colors.navy },
  text: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary },
  textActive: { color: colors.white, fontFamily: font.semibold },
});

// ---------- EmptyState ----------
export function EmptyState({
  icon, title, message, ctaLabel, onPress,
}: { icon: keyof typeof Ionicons.glyphMap; title: string; message: string; ctaLabel?: string; onPress?: () => void }) {
  return (
    <View style={emptyStyles.wrap}>
      <View style={emptyStyles.iconWrap}>
        <Ionicons name={icon} size={36} color={colors.ocean} />
      </View>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.message}>{message}</Text>
      {ctaLabel && onPress && (
        <Button label={ctaLabel} onPress={onPress} variant="primary" style={{ marginTop: spacing.lg, paddingHorizontal: 32 }} fullWidth={false} />
      )}
    </View>
  );
}
const emptyStyles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontFamily: font.semibold, fontSize: 17, color: colors.textPrimary, marginBottom: 6, textAlign: 'center' },
  message: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

// ---------- ErrorState (recovery CTA) ----------
export function ErrorState({
  icon = 'cloud-offline-outline', title, message, ctaLabel = 'Try Again', onPress,
}: { icon?: keyof typeof Ionicons.glyphMap; title: string; message: string; ctaLabel?: string; onPress?: () => void }) {
  return (
    <View style={emptyStyles.wrap}>
      <View style={[emptyStyles.iconWrap, { backgroundColor: '#FDECEA' }]}>
        <Ionicons name={icon} size={36} color={colors.error} />
      </View>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.message}>{message}</Text>
      {onPress && <Button label={ctaLabel} onPress={onPress} variant="destructive" style={{ marginTop: spacing.lg, paddingHorizontal: 32 }} fullWidth={false} />}
    </View>
  );
}

// ---------- Skeleton ----------
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: { width?: number | string; height?: number; radius?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[{ width: width as any, height, borderRadius: radius, backgroundColor: colors.disabledBg, opacity }, style]} />;
}

// ---------- StarRating ----------
export function StarRating({ rating, size = 16, showValue = false }: { rating: number; size?: number; showValue?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.gold}
          style={{ marginRight: 2 }}
        />
      ))}
      {showValue && <Text style={{ fontFamily: font.semibold, fontSize: size - 2, color: colors.textPrimary, marginLeft: 4 }}>{rating.toFixed(1)}</Text>}
    </View>
  );
}

// ---------- ScreenHeader ----------
export function ScreenHeader({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={headerStyles.wrap}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {onBack !== undefined && (
          <Pressable onPress={onBack ?? (() => router.back())} hitSlop={10} style={headerStyles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={headerStyles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={headerStyles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right}
    </View>
  );
}
const headerStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  backBtn: { marginRight: 8, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.disabledBg },
  title: { fontFamily: font.semibold, fontSize: 20, color: colors.textPrimary },
  subtitle: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
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
