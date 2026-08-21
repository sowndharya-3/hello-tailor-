import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

const LABELS = ['Home', 'Work', 'Other'] as const;

export default function AddAddress() {
  const addAddress = useStore((s) => s.addAddress);
  const [label, setLabel] = useState<(typeof LABELS)[number]>('Home');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [located, setLocated] = useState(false);

  const canSave = address.trim().length > 5 && pincode.length === 6;

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Add Address" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <Text style={styles.label}>Label</Text>
        <View style={styles.chipsWrap}>
          {LABELS.map((l) => (
            <Pressable key={l} style={[styles.chip, label === l && styles.chipActive]} onPress={() => setLabel(l)}>
              <Text style={[styles.chipText, label === l && styles.chipTextActive]}>{l}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.locateBtn} onPress={() => setLocated(true)}>
          <Ionicons name="locate-outline" size={18} color={colors.secondary} />
          <Text style={styles.locateText}>{located ? 'Location Captured' : 'Use Current Location'}</Text>
        </Pressable>

        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={26} color={colors.secondary} />
          <Text style={styles.mapText}>Tap on the map to pin your exact address</Text>
        </View>

        <Input label="Address" placeholder="Flat / Building / Street" value={address} onChangeText={setAddress} multiline />
        <Input label="Landmark" optional placeholder="Nearby landmark" value={landmark} onChangeText={setLandmark} />
        <Input label="City" value={city} onChangeText={setCity} />
        <Input label="State" value={state} onChangeText={setState} />
        <Input label="Pincode" placeholder="600040" keyboardType="number-pad" maxLength={6} value={pincode} onChangeText={setPincode} />

        <Button
          label="Save Address"
          disabled={!canSave}
          onPress={() => {
            addAddress({ id: `a-${Date.now()}`, label, address, landmark, city, state, pincode, isDefault: false });
            router.back();
          }}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  locateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  locateText: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
  mapPlaceholder: { height: 130, borderRadius: radius.card, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: spacing.lg },
  mapText: { ...type.supporting, color: colors.secondary },
});
