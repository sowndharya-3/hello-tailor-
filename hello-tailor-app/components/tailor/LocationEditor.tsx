// Ported from tailor-app/components/LocationEditor.tsx unchanged. address/landmark/pincode
// are NOT on the shared Tailor type (only city/state/locality are) — callers keep this value
// as local screen state and persist only the overlapping fields to the store.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { colors, font, radii, spacing } from '@/theme';

export interface LocationValue {
  address: string; landmark: string; city: string; state: string; pincode: string;
}

const SUGGESTIONS = [
  'MG Road, Bengaluru', 'Indiranagar, Bengaluru', 'Koramangala, Bengaluru', 'Whitefield, Bengaluru',
];

export function LocationEditor({ value, onChange, onSave }: { value: LocationValue; onChange: (v: LocationValue) => void; onSave: () => void }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LocationValue, string>>>({});

  const set = (k: keyof LocationValue, v: string) => onChange({ ...value, [k]: v });

  const useCurrentLocation = () => {
    onChange({ address: '12, MG Road, Near Central Mall', landmark: 'Opposite Axis Bank', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' });
    setSearch('MG Road, Bengaluru');
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!value.address.trim()) next.address = 'Address is required';
    if (!value.city.trim()) next.city = 'City is required';
    if (!value.state.trim()) next.state = 'State is required';
    if (!/^\d{6}$/.test(value.pincode)) next.pincode = 'Enter a valid 6-digit pincode';
    setErrors(next);
    if (Object.keys(next).length === 0) onSave();
  };

  return (
    <View>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <Text style={styles.searchInput} onPress={() => setShowSuggestions(true)}>
          {search || 'Search address or locality'}
        </Text>
      </View>
      {showSuggestions && (
        <View style={styles.suggestBox}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} style={styles.suggestRow} onPress={() => { setSearch(s); setShowSuggestions(false); useCurrentLocation(); }}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.suggestText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.mapBox}>
        <Ionicons name="map-outline" size={30} color={colors.ocean} />
        <Text style={styles.mapText}>Map preview (pin drop)</Text>
        <Ionicons name="location" size={30} color={colors.error} style={{ position: 'absolute', top: '42%' }} />
      </View>

      <Pressable style={styles.currentLocBtn} onPress={useCurrentLocation}>
        <Ionicons name="navigate-outline" size={16} color={colors.ocean} />
        <Text style={styles.currentLocText}>Use my current location</Text>
      </Pressable>

      <Input label="Address" placeholder="House / building no., street" value={value.address} onChangeText={(v) => set('address', v)} error={errors.address} />
      <Input label="Landmark" placeholder="e.g. Opposite Axis Bank" value={value.landmark} onChangeText={(v) => set('landmark', v)} optional />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Input label="City" placeholder="Bengaluru" value={value.city} onChangeText={(v) => set('city', v)} error={errors.city} />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="State" placeholder="Karnataka" value={value.state} onChangeText={(v) => set('state', v)} error={errors.state} />
        </View>
      </View>
      <Input label="Pincode" placeholder="560001" keyboardType="number-pad" maxLength={6} value={value.pincode} onChangeText={(v) => set('pincode', v.replace(/[^0-9]/g, ''))} error={errors.pincode} />

      <Button label="Save Location" onPress={validate} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.search, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 14, height: 48, marginBottom: 8 },
  searchInput: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, marginLeft: 8 },
  suggestBox: { backgroundColor: colors.white, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, overflow: 'hidden' },
  suggestRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  suggestText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary },
  mapBox: { height: 160, borderRadius: radii.card, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  mapText: { fontFamily: font.medium, fontSize: 12, color: colors.ocean, marginTop: 6 },
  currentLocBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: spacing.lg },
  currentLocText: { fontFamily: font.semibold, fontSize: 13, color: colors.ocean, marginLeft: 6 },
});
