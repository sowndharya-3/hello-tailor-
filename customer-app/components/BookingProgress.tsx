import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, type, spacing } from '../constants/theme';

export const BOOKING_STEPS = [
  'category', 'person', 'cloth-details', 'design-upload', 'measurement',
  'date', 'delivery', 'method', 'notes', 'summary', 'payment',
];

export default function BookingProgress({ step }: { step: string }) {
  const index = BOOKING_STEPS.indexOf(step);
  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${((index + 1) / BOOKING_STEPS.length) * 100}%` }]} />
      </View>
      <Text style={styles.label}>Step {index + 1} of {BOOKING_STEPS.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.screenH, marginBottom: spacing.md },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  fill: { height: 5, backgroundColor: colors.secondary },
  label: { ...type.supporting, color: colors.textSecondary, marginTop: 6 },
});
