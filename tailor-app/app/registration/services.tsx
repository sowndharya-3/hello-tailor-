import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress, Chip } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function ServicesStep() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const isShop = profile.tailorType === 'shop';
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    setError('');
  };

  const onNext = () => {
    if (selected.length === 0) { setError('Select at least one stitching category'); return; }
    updateProfile({ categories: selected });
    router.push('/registration/pricing');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Stitching Categories" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <StepProgress step={isShop ? 4 : 3} total={isShop ? 7 : 6} label="Services" />
        <Text style={styles.helper}>Select all the categories you offer. You can update this anytime from your profile.</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.name} icon={c.icon as any} selected={selected.includes(c.id)} onPress={() => toggle(c.id)} />
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button label={`Continue (${selected.length} selected)`} onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
  helper: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: 18 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.error, marginTop: 4 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
