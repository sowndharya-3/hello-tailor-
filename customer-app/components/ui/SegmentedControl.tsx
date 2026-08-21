import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, type } from '../../constants/theme';

export default function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable key={opt} onPress={() => onChange(opt)} style={[styles.seg, active && styles.segActive]}>
            <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.disabledBg,
    borderRadius: radius.button,
    padding: 4,
  },
  seg: { flex: 1, paddingVertical: 10, borderRadius: radius.button - 3, alignItems: 'center' },
  segActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  text: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
  textActive: { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
});
