// Vertical progress stepper for order stages. Ported from tailor-app/components/StatusStepper.tsx,
// driven by the shared BOOKING_STAGES list instead of tailor-app's own ORDER_STAGES.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BOOKING_STAGES } from '@/store/types';
import { colors, font, spacing } from '@/theme';

export function StatusStepper({ current }: { current: string }) {
  const idx = BOOKING_STAGES.indexOf(current as any);

  return (
    <View>
      {BOOKING_STAGES.map((stage, i) => {
        const done = i < idx;
        const active = i === idx;
        const isLast = i === BOOKING_STAGES.length - 1;
        return (
          <View key={stage} style={styles.row}>
            <View style={styles.iconCol}>
              <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                {done ? <Ionicons name="checkmark" size={13} color={colors.white} /> : active ? <View style={styles.activeInner} /> : null}
              </View>
              {!isLast && <View style={[styles.line, (done || active) && styles.lineDone]} />}
            </View>
            <View style={{ paddingBottom: spacing.lg, flex: 1 }}>
              <Text style={[styles.label, (done || active) && styles.labelActive]}>{stage}</Text>
              {active && <Text style={styles.currentTag}>Current stage</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  iconCol: { alignItems: 'center', width: 28 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.success },
  dotActive: { backgroundColor: colors.white, borderWidth: 3, borderColor: colors.ocean },
  activeInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ocean },
  line: { width: 2, flex: 1, backgroundColor: colors.disabledBg, marginTop: 2 },
  lineDone: { backgroundColor: colors.success },
  label: { fontFamily: font.medium, fontSize: 14, color: colors.textSecondary, marginLeft: spacing.md, marginTop: 2 },
  labelActive: { fontFamily: font.semibold, color: colors.textPrimary },
  currentTag: { fontFamily: font.medium, fontSize: 11, color: colors.ocean, marginLeft: spacing.md, marginTop: 2 },
});
