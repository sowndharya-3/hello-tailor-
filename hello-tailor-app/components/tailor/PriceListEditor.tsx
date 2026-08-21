// Ported from tailor-app/components/PriceListEditor.tsx, driven by shared PriceEntry type
// (store/useStore) and the shared category catalog (data/seed) instead of tailor-app's own.
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { categories } from '@/data/seed';
import SegmentedControl from '@/components/ui/SegmentedControl';
import type { PriceEntry } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

export function PriceListEditor({ categoryIds, prices, onChange }: { categoryIds: string[]; prices: PriceEntry[]; onChange: (p: PriceEntry[]) => void }) {
  const entryFor = (catId: string): PriceEntry =>
    prices.find((p) => p.categoryId === catId) ?? { categoryId: catId, type: 'Starting at', price: '', notes: '' };

  const update = (catId: string, patch: Partial<PriceEntry>) => {
    const existing = entryFor(catId);
    const next = { ...existing, ...patch };
    onChange([...prices.filter((p) => p.categoryId !== catId), next]);
  };

  return (
    <View>
      {categoryIds.map((catId) => {
        const cat = categories.find((c) => c.id === catId);
        const entry = entryFor(catId);
        return (
          <View key={catId} style={styles.card}>
            <Text style={styles.catName}>{cat?.name ?? catId}</Text>
            <SegmentedControl options={['Starting at', 'Fixed']} value={entry.type} onChange={(v) => update(catId, { type: v as PriceEntry['type'] })} />
            <View style={styles.priceRow}>
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                value={entry.price}
                onChangeText={(v) => update(catId, { price: v.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                style={styles.priceInput}
              />
            </View>
            <TextInput
              value={entry.notes}
              onChangeText={(v) => update(catId, { notes: v })}
              placeholder="Notes (e.g. excludes lining)"
              placeholderTextColor={colors.textSecondary}
              style={styles.notesInput}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  catName: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: 14, height: 48 },
  rupee: { fontFamily: font.semibold, fontSize: 16, color: colors.textSecondary, marginRight: 6 },
  priceInput: { flex: 1, fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary },
  notesInput: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm, paddingVertical: 4 },
});
