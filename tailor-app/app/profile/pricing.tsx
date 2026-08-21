import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { PriceListEditor } from '@/components/PriceListEditor';
import { useStore } from '@/store/useStore';
import type { PriceEntry } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditPricing() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [prices, setPrices] = useState<PriceEntry[]>(profile.prices);

  const onSave = () => {
    updateProfile({ prices });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Price List" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <PriceListEditor categoryIds={profile.categories} prices={prices} onChange={setPrices} />
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
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
