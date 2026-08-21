import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { categories, measurementFieldsByCategory } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

export default function AddMeasurement() {
  const family = useStore((s) => s.family);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const people = [{ id: 'self', name: 'Myself' }, ...family.map((f) => ({ id: f.id, name: f.name }))];
  const [personId, setPersonId] = useState('self');
  const [category, setCategory] = useState(categories[0].name);
  const [label, setLabel] = useState('');
  const fields = measurementFieldsByCategory[category] ?? [];
  const [values, setValues] = useState<Record<string, string>>({});

  const canSave = label.trim() && fields.every((f) => values[f]?.trim());

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="New Measurement" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <Input label="Measurement Name" placeholder="e.g. Formal Shirt Measurement" value={label} onChangeText={setLabel} />

        <Text style={styles.label}>For</Text>
        <View style={styles.chipsWrap}>
          {people.map((p) => (
            <Pressable key={p.id} style={[styles.chip, personId === p.id && styles.chipActive]} onPress={() => setPersonId(p.id)}>
              <Text style={[styles.chipText, personId === p.id && styles.chipTextActive]}>{p.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Category</Text>
        <View style={styles.chipsWrap}>
          {categories.map((c) => (
            <Pressable key={c.id} style={[styles.chip, category === c.name && styles.chipActive]} onPress={() => setCategory(c.name)}>
              <Text style={[styles.chipText, category === c.name && styles.chipTextActive]}>{c.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {fields.map((f) => (
            <View key={f} style={{ marginBottom: spacing.md }}>
              <Text style={styles.label}>{f} (in)</Text>
              <TextInput
                value={values[f] ?? ''}
                onChangeText={(v) => setValues((prev) => ({ ...prev, [f]: v }))}
                keyboardType="decimal-pad"
                placeholder="e.g. 38"
                placeholderTextColor={colors.disabledText}
                style={styles.input}
              />
            </View>
          ))}
        </View>

        <Button
          label="Save Measurement"
          disabled={!canSave}
          onPress={() => {
            addMeasurement({ id: `m-${Date.now()}`, label, personId, category, date: 'Today', fields: values });
            router.back();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  input: { height: 50, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, paddingHorizontal: 14, ...type.body, color: colors.text, backgroundColor: colors.white },
});
