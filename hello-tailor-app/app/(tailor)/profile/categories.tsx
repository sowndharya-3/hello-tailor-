// Ported from tailor-app/app/profile/categories.tsx — the shared Tailor.categories field
// stores category NAMES (not ids, see data/seed.ts), so selection/persistence is keyed on name.
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import { categories } from '@/data/seed';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function EditCategories() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [selected, setSelected] = useState<string[]>(tailor.categories);

  const toggle = (name: string) => setSelected((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  const onSave = () => {
    updateTailorProfile({ categories: selected });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Stitching Categories" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.helper}>These categories come from Hello Tailor's master category list. Toggle the ones you offer.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} icon={c.icon as any} selected={selected.includes(c.name)} onPress={() => toggle(c.name)} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Save Changes" onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
  helper: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: 18 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
