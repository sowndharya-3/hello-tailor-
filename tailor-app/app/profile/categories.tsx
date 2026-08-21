import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, Chip } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function EditCategories() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [selected, setSelected] = useState<string[]>(profile.categories);

  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const onSave = () => {
    updateProfile({ categories: selected });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Stitching Categories" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.helper}>These categories come from Hello Tailor's master category list. Toggle the ones you offer.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.name} icon={c.icon as any} selected={selected.includes(c.id)} onPress={() => toggle(c.id)} />
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
