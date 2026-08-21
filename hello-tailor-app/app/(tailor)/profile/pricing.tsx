// Ported from tailor-app/app/profile/pricing.tsx — myPrices/setPrices live at the store's top
// level.
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { PriceListEditor } from '@/components/tailor/PriceListEditor';
import { useMyTailor, useStore } from '@/store/useStore';
import type { PriceEntry } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditPricing() {
  const tailor = useMyTailor();
  const myPrices = useStore((s) => s.myPrices);
  const setPrices = useStore((s) => s.setPrices);
  const [prices, setLocalPrices] = useState<PriceEntry[]>(myPrices);

  const onSave = () => {
    setPrices(prices);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Price List" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <PriceListEditor categoryIds={tailor.categories} prices={prices} onChange={setLocalPrices} />
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
