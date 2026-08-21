// Ported from customer-app/app/ai-design/index.tsx — future-concept, static/mock UI, no real
// AI call. `categories` now comes from the shared seed.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, type, spacing, radius } from '@/theme';
import { categories } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const PREFERENCES = ['Minimal', 'Traditional', 'Contemporary', 'Fusion', 'Formal'];

export default function AIDesign() {
  const [garment, setGarment] = useState(categories[0].name);
  const [pref, setPref] = useState(PREFERENCES[0]);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle');

  const pickRef = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setRefImage(result.assets[0].uri);
  };

  const generate = () => {
    setState('generating');
    setTimeout(() => setState('done'), 1800);
  };

  const suggestions = [0, 1, 2, 3].map((i) => `https://picsum.photos/seed/aidesign-${garment}-${pref}-${i}/400/500`);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="AI Design Suggestions" subtitle="Beta" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.betaBanner}>
          <Ionicons name="sparkles" size={18} color={colors.gold} />
          <Text style={styles.betaText}>Get AI-generated design ideas for your next stitching order.</Text>
          <Badge label="BETA" tone="gold" withIcon={false} />
        </View>

        <Text style={styles.label}>Select Garment</Text>
        <View style={styles.chipsWrap}>
          {categories.map((c) => (
            <Pressable key={c.id} style={[styles.chip, garment === c.name && styles.chipActive]} onPress={() => { setGarment(c.name); setState('idle'); }}>
              <Text style={[styles.chipText, garment === c.name && styles.chipTextActive]}>{c.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Style Preference</Text>
        <View style={styles.chipsWrap}>
          {PREFERENCES.map((p) => (
            <Pressable key={p} style={[styles.chip, pref === p && styles.chipActive]} onPress={() => { setPref(p); setState('idle'); }}>
              <Text style={[styles.chipText, pref === p && styles.chipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Reference Photo <Text style={styles.hint}>(optional)</Text></Text>
        {refImage ? (
          <Image source={{ uri: refImage }} style={styles.refImg} />
        ) : (
          <Pressable style={styles.attachBtn} onPress={pickRef}>
            <Ionicons name="image-outline" size={20} color={colors.secondary} />
            <Text style={styles.attachText}>Upload Reference</Text>
          </Pressable>
        )}

        <Button label="Generate Suggestions" variant="gold" style={{ marginTop: spacing.lg }} onPress={generate} loading={state === 'generating'} />

        {state === 'done' ? (
          <View style={styles.grid}>
            {suggestions.map((uri) => (
              <View key={uri} style={styles.suggestionCard}>
                <Image source={{ uri }} style={styles.suggestionImg} />
                <View style={styles.suggestionActions}>
                  <Pressable style={styles.suggestionBtn} onPress={() => Alert.alert('Saved', 'Design saved to your favourites.')}>
                    <Ionicons name="bookmark-outline" size={16} color={colors.secondary} />
                    <Text style={styles.suggestionBtnText}>Save</Text>
                  </Pressable>
                  <Pressable style={[styles.suggestionBtn, styles.suggestionBtnPrimary]} onPress={() => Alert.alert('Added to Booking', 'This design reference will be used in your next booking.')}>
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                    <Text style={[styles.suggestionBtnText, { color: colors.white }]}>Use in Booking</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  betaBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.goldLightBg, borderRadius: radius.card, padding: spacing.cardInner, marginBottom: spacing.lg },
  betaText: { flex: 1, ...type.supporting, color: colors.gold },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  hint: { ...type.supporting, color: colors.textSecondary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  attachBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', justifyContent: 'center' },
  attachText: { ...type.body, color: colors.secondary, fontFamily: 'Inter_500Medium' },
  refImg: { width: 100, height: 100, borderRadius: radius.input },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.section },
  suggestionCard: { width: '47%', borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  suggestionImg: { width: '100%', height: 160 },
  suggestionActions: { padding: 8, gap: 6 },
  suggestionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: radius.button, borderWidth: 1, borderColor: colors.secondary },
  suggestionBtnPrimary: { backgroundColor: colors.secondary },
  suggestionBtnText: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary, fontSize: 11 },
});
