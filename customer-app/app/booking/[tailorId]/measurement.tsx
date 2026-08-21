import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { measurementFieldsByCategory } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import SegmentedControl from '../../../components/ui/SegmentedControl';
import { useApp } from '../../../store/AppState';

export default function MeasurementStep() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, updateBooking, measurements, addMeasurement } = useApp();
  const savedForPerson = measurements.filter((m) => m.personId === booking.personId && m.category === booking.category);

  const [mode, setMode] = useState(savedForPerson.length ? 'Use Saved' : 'New Measurement');
  const [selectedSaved, setSelectedSaved] = useState(savedForPerson[0]?.id);
  const fields = measurementFieldsByCategory[booking.category ?? 'Men'] ?? ['Length'];
  const [values, setValues] = useState<Record<string, string>>({});
  const [label, setLabel] = useState(`${booking.category} Measurement`);

  const canContinue = mode === 'Use Saved' ? !!selectedSaved : fields.every((f) => values[f]?.trim());

  const submit = () => {
    if (mode === 'Use Saved') {
      updateBooking({ measurementId: selectedSaved });
    } else {
      const id = `m-local-${Date.now()}`;
      addMeasurement({ id, label, personId: booking.personId ?? 'self', category: booking.category ?? '', date: 'Today', fields: values });
      updateBooking({ measurementId: id });
    }
    router.push(`/booking/${tailorId}/date`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Measurement"
        subtitle={booking.category}
        right={
          <Pressable onPress={() => router.push(`/booking/${tailorId}/measurement-history`)}>
            <Ionicons name="time-outline" size={22} color={colors.secondary} />
          </Pressable>
        }
      />
      <BookingProgress step="measurement" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, gap: spacing.lg }}>
        <SegmentedControl options={['Use Saved', 'New Measurement']} value={mode} onChange={setMode} />

        {mode === 'Use Saved' ? (
          savedForPerson.length ? (
            <View style={{ gap: 10 }}>
              {savedForPerson.map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.savedCard, selectedSaved === m.id && styles.savedCardActive]}
                  onPress={() => setSelectedSaved(m.id)}
                >
                  <Ionicons name="body-outline" size={24} color={colors.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.savedLabel}>{m.label}</Text>
                    <Text style={styles.savedSub}>Saved on {m.date} • {Object.keys(m.fields).length} fields</Text>
                  </View>
                  <Ionicons name={selectedSaved === m.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.secondary} />
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No saved measurements for this person & category yet. Add a new one below.</Text>
          )
        ) : (
          <View>
            <Text style={styles.label}>Measurement Name</Text>
            <TextInput value={label} onChangeText={setLabel} style={styles.input} placeholderTextColor={colors.disabledText} />
            <View style={styles.illustration}>
              <Ionicons name="body-outline" size={48} color={colors.secondary} />
              <Text style={styles.illustrationText}>Enter measurements in inches based on your {booking.category?.toLowerCase()} garment</Text>
            </View>
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
        )}
      </ScrollView>
      <StepFooter label="Continue" onPress={submit} disabled={!canContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  input: { height: 50, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, paddingHorizontal: 14, ...type.body, color: colors.text, marginBottom: spacing.md, backgroundColor: colors.white },
  savedCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.border, padding: spacing.cardInner },
  savedCardActive: { borderColor: colors.secondary, backgroundColor: colors.infoBg },
  savedLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  savedSub: { ...type.supporting, color: colors.textSecondary },
  emptyText: { ...type.body, color: colors.textSecondary },
  illustration: { alignItems: 'center', gap: 8, paddingVertical: spacing.lg, backgroundColor: colors.infoBg, borderRadius: radius.card, marginBottom: spacing.lg },
  illustrationText: { ...type.supporting, color: colors.secondary, textAlign: 'center', paddingHorizontal: spacing.xl },
});
