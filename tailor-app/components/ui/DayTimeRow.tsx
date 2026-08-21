import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors, font, radii, spacing } from '@/theme';
import { BottomSheet } from './BottomSheet';
import type { DayHours } from '@/store/useStore';

const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

function to12h(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function TimeChip({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={[chipStyles.chip, disabled && chipStyles.disabled]}>
      <Text style={[chipStyles.text, disabled && chipStyles.disabledText]}>{to12h(label)}</Text>
    </Pressable>
  );
}
const chipStyles = StyleSheet.create({
  chip: { flex: 1, paddingVertical: 10, borderRadius: radii.input, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', marginHorizontal: 4, backgroundColor: colors.white },
  disabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  text: { fontFamily: font.medium, fontSize: 13, color: colors.textPrimary },
  disabledText: { color: colors.disabledText },
});

export function DayTimeRow({
  row, onChange, onApplyToAll,
}: { row: DayHours; onChange: (r: DayHours) => void; onApplyToAll?: () => void }) {
  const [pickerField, setPickerField] = useState<'from' | 'to' | null>(null);

  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <Text style={styles.day}>{row.day}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {onApplyToAll && row.open && (
            <Pressable onPress={onApplyToAll} hitSlop={8}>
              <Text style={styles.applyAll}>Apply to all</Text>
            </Pressable>
          )}
          <Switch
            value={row.open}
            onValueChange={(v) => onChange({ ...row, open: v })}
            trackColor={{ false: colors.disabledBg, true: colors.ocean }}
            thumbColor={colors.white}
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>
      {row.open ? (
        <View style={styles.times}>
          <TimeChip label={row.from} onPress={() => setPickerField('from')} />
          <Text style={styles.dash}>to</Text>
          <TimeChip label={row.to} onPress={() => setPickerField('to')} />
        </View>
      ) : (
        <Text style={styles.closedText}>Closed</Text>
      )}

      <BottomSheet visible={pickerField !== null} onClose={() => setPickerField(null)} title={`Select ${pickerField === 'from' ? 'opening' : 'closing'} time`}>
        <FlatList
          data={TIME_OPTIONS}
          keyExtractor={(t) => t}
          style={{ maxHeight: 360 }}
          renderItem={({ item }) => {
            const active = pickerField === 'from' ? row.from === item : row.to === item;
            return (
              <Pressable
                style={[sheetStyles.option, active && sheetStyles.optionActive]}
                onPress={() => { onChange({ ...row, [pickerField as 'from' | 'to']: item }); setPickerField(null); }}
              >
                <Text style={[sheetStyles.optionText, active && sheetStyles.optionTextActive]}>{to12h(item)}</Text>
              </Pressable>
            );
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  day: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, width: 44 },
  applyAll: { fontFamily: font.medium, fontSize: 12, color: colors.ocean },
  times: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  dash: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginHorizontal: 2 },
  closedText: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 6 },
});
const sheetStyles = StyleSheet.create({
  option: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: radii.input },
  optionActive: { backgroundColor: colors.infoBg },
  optionText: { fontFamily: font.regular, fontSize: 15, color: colors.textPrimary },
  optionTextActive: { fontFamily: font.semibold, color: colors.ocean },
});
