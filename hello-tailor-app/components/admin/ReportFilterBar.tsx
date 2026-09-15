// Step 15/18 — the report filter toolbar: period type (Daily/Weekly/Monthly/Yearly/Custom),
// contextual presets per period, a Custom From/To range via MiniCalendar, Apply/Reset. Fully
// controlled from outside (the report screen owns the committed range) so Apply is the one
// moment a re-render/re-filter of the underlying data actually happens — typing/tapping around
// inside the toolbar before Apply never touches the report below it.
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BottomSheet from '@/components/ui/BottomSheet';
import { colors, font, radius, spacing } from '@/theme';
import MiniCalendar from './MiniCalendar';
import {
  PRESETS_BY_PERIOD, defaultRangeFor, resolvePreset, formatDDMMYYYY,
  type DateRange, type ReportPeriod,
} from '@/lib/dateRanges';

const PERIODS: ReportPeriod[] = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

export default function ReportFilterBar({
  range,
  onApply,
}: {
  range: DateRange;
  onApply: (range: DateRange) => void;
}) {
  // Pending state lives here until Apply commits it up — Reset/period-switching only touches
  // this local draft, never the parent's applied `range`.
  const [period, setPeriod] = useState<ReportPeriod>('Monthly');
  const [pendingRange, setPendingRange] = useState<DateRange>(range);
  const [pickerFor, setPickerFor] = useState<'from' | 'to' | null>(null);

  const selectPeriod = (p: ReportPeriod) => {
    setPeriod(p);
    if (p !== 'Custom') setPendingRange(resolvePreset(p, PRESETS_BY_PERIOD[p][0]));
  };

  const selectPreset = (preset: string) => {
    if (period === 'Custom') return;
    setPendingRange(resolvePreset(period, preset));
  };

  const reset = () => {
    setPeriod('Monthly');
    const def = defaultRangeFor('Monthly');
    setPendingRange(def);
    onApply(def);
  };

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>Period</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: spacing.sm }}>
        {PERIODS.map((p) => (
          <Pressable key={p} onPress={() => selectPeriod(p)} style={[styles.chip, period === p && styles.chipActive]}>
            <Text style={[styles.chipText, period === p && styles.chipTextActive]}>{p}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {period !== 'Custom' ? (
        <>
          <Text style={[styles.label, { marginTop: spacing.sm }]}>Quick range</Text>
          <View style={styles.presetRow}>
            {PRESETS_BY_PERIOD[period].map((preset) => {
              const active = JSON.stringify(resolvePreset(period, preset)) === JSON.stringify(pendingRange);
              return (
                <Pressable key={preset} onPress={() => selectPreset(preset)} style={[styles.presetChip, active && styles.presetChipActive]}>
                  <Text style={[styles.presetChipText, active && styles.presetChipTextActive]}>{preset}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.label, { marginTop: spacing.sm }]}>Date range</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateBtn} onPress={() => setPickerFor('from')}>
              <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
              <View>
                <Text style={styles.dateBtnLabel}>From</Text>
                <Text style={styles.dateBtnValue}>{formatDDMMYYYY(pendingRange.from)}</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dateBtn} onPress={() => setPickerFor('to')}>
              <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
              <View>
                <Text style={styles.dateBtnLabel}>To</Text>
                <Text style={styles.dateBtnValue}>{formatDDMMYYYY(pendingRange.to)}</Text>
              </View>
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.actionsRow}>
        <Button label="Reset" variant="outline" onPress={reset} style={{ flex: 1 }} />
        <Button label="Apply Filter" onPress={() => onApply(pendingRange)} style={{ flex: 1 }} />
      </View>

      <BottomSheet visible={pickerFor !== null} onClose={() => setPickerFor(null)} title={pickerFor === 'from' ? 'From Date' : 'To Date'}>
        <MiniCalendar
          value={pickerFor === 'from' ? pendingRange.from : pendingRange.to}
          maxDate={pickerFor === 'from' ? pendingRange.to : undefined}
          onSelect={(d) => {
            // Clamp rather than allow an inverted range — picking a "To" earlier than the
            // current "From" (or vice versa) collapses both ends to the picked date instead of
            // silently producing a from > to range the filter logic below never accounts for.
            if (pickerFor === 'from') {
              setPendingRange((r) => ({ from: d, to: d.getTime() > r.to.getTime() ? d : r.to }));
            } else {
              setPendingRange((r) => ({ from: d.getTime() < r.from.getTime() ? d : r.from, to: d }));
            }
            setPickerFor(null);
          }}
        />
      </BottomSheet>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontFamily: font.medium, fontSize: 12.5, color: colors.text },
  chipTextActive: { color: colors.white },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  presetChipActive: { backgroundColor: colors.ocean, borderColor: colors.ocean },
  presetChipText: { fontFamily: font.medium, fontSize: 12.5, color: colors.text },
  presetChipTextActive: { color: colors.white },
  dateRow: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 140, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 10 },
  dateBtnLabel: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary },
  dateBtnValue: { fontFamily: font.semibold, fontSize: 13.5, color: colors.text, marginTop: 1 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});
