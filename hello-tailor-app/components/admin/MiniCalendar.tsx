// Compact month-grid date picker for the Custom From/To range (Step 15) — unlike the customer
// booking flow's 21-day forward-only strip (mock "tailor availability" list, not a real
// calendar), admin reports need to reach arbitrary past dates, so this is a real prev/next-month
// grid.
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function MiniCalendar({
  value,
  onSelect,
  maxDate,
}: {
  value: Date;
  onSelect: (d: Date) => void;
  maxDate?: Date;
}) {
  const [viewDate, setViewDate] = useState(new Date(value.getFullYear(), value.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  const isSelected = (day: number) => value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;
  const isDisabled = (day: number) => (maxDate ? new Date(year, month, day).getTime() > maxDate.getTime() : false);

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => setViewDate(new Date(year, month - 1, 1))} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.monthLabel}>{viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
        <Pressable onPress={() => setViewDate(new Date(year, month + 1, 1))} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={`${w}${i}`} style={styles.weekday}>{w}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => (
          <View key={i} style={styles.cellWrap}>
            {day ? (
              <Pressable
                disabled={isDisabled(day)}
                onPress={() => onSelect(new Date(year, month, day))}
                style={[styles.cell, isSelected(day) && styles.cellSelected]}
              >
                <Text style={[styles.cellText, isSelected(day) && styles.cellTextSelected, isDisabled(day) && styles.cellTextDisabled]}>
                  {day}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  monthLabel: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  weekRow: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontFamily: font.medium, fontSize: 11, color: colors.textSecondary, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cell: { width: 34, height: 34, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  cellSelected: { backgroundColor: colors.ocean },
  cellText: { fontFamily: font.regular, fontSize: 13, color: colors.text },
  cellTextSelected: { color: colors.white, fontFamily: font.semibold },
  cellTextDisabled: { color: colors.disabledText },
});
