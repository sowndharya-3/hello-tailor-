import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { clothTypesByCategory } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

const COLOURS = [
  { name: 'Navy', hex: '#173B57' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#E8DCC4' },
  { name: 'Maroon', hex: '#7A1F2B' }, { name: 'Black', hex: '#1A1A1A' }, { name: 'Sky Blue', hex: '#8FC5E8' },
];

export default function ClothDetails() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, updateBooking } = useApp();
  const clothOptions = clothTypesByCategory[booking.category ?? 'Men'] ?? ['Cotton'];

  const [clothType, setClothType] = useState(clothOptions[0]);
  const [colour, setColour] = useState(COLOURS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [provided, setProvided] = useState(true);
  const [notes, setNotes] = useState('');

  const submit = () => {
    updateBooking({ clothType, colour, quantity, customerProvidedCloth: provided, clothNotes: notes });
    router.push(`/booking/${tailorId}/design-upload`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Cloth Details" subtitle={booking.category} />
      <BookingProgress step="cloth-details" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, gap: spacing.lg }}>
        <View>
          <Text style={styles.label}>Cloth Type / Material</Text>
          <View style={styles.chipsWrap}>
            {clothOptions.map((c) => (
              <Pressable key={c} style={[styles.chip, clothType === c && styles.chipActive]} onPress={() => setClothType(c)}>
                <Text style={[styles.chipText, clothType === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Colour</Text>
          <View style={styles.chipsWrap}>
            {COLOURS.map((c) => (
              <Pressable key={c.name} style={[styles.colourChip, colour === c.name && styles.chipActive]} onPress={() => setColour(c.name)}>
                <View style={[styles.swatch, { backgroundColor: c.hex, borderColor: colors.border }]} />
                <Text style={[styles.chipText, colour === c.name && styles.chipTextActive]}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.qtyRow}>
            <Pressable style={styles.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
              <Ionicons name="add" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.toggleRow} onPress={() => setProvided((v) => !v)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>I will provide the cloth</Text>
            <Text style={styles.hint}>Turn off if you'd like the tailor to source the fabric for you</Text>
          </View>
          <Ionicons name={provided ? 'toggle' : 'toggle-outline'} size={40} color={provided ? colors.secondary : colors.disabledText} />
        </Pressable>

        <View>
          <Text style={styles.label}>Notes <Text style={styles.hint}>(optional)</Text></Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special instructions for the cloth..."
            placeholderTextColor={colors.disabledText}
            multiline
            style={styles.textArea}
          />
        </View>
      </ScrollView>
      <StepFooter label="Continue" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 10 },
  hint: { ...type.supporting, color: colors.textSecondary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  colourChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  swatch: { width: 16, height: 16, borderRadius: 8, borderWidth: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { ...type.cardTitle, color: colors.text, minWidth: 24, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textArea: { minHeight: 90, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, textAlignVertical: 'top', ...type.body, color: colors.text },
});
