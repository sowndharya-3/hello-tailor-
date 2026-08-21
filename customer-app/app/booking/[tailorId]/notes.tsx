import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

export default function Notes() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { updateBooking } = useApp();
  const [notes, setNotes] = useState('');

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Additional Notes" subtitle="Anything else the tailor should know?" />
      <BookingProgress step="notes" />
      <View style={{ padding: spacing.screenH }}>
        <Text style={styles.label}>Notes <Text style={styles.hint}>(optional)</Text></Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="E.g. Please keep the fit slightly loose around the waist..."
          placeholderTextColor={colors.disabledText}
          multiline
          style={styles.textArea}
        />
      </View>
      <StepFooter
        label="Continue to Summary"
        onPress={() => {
          updateBooking({ notes });
          router.push(`/booking/${tailorId}/summary`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  hint: { ...type.supporting, color: colors.textSecondary },
  textArea: { minHeight: 140, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 14, textAlignVertical: 'top', ...type.body, color: colors.text, backgroundColor: colors.white },
});
