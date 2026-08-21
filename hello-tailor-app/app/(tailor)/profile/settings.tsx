// Ported from tailor-app/app/profile/settings.tsx. Only `deliveryDays` exists on the shared
// Tailor type — min order value / lead time / stitching duration have no field in the shared
// schema, so they're kept as local-only inputs here (ponytail: UI-only, add store fields if a
// future screen needs to read them back).
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function OrderSettings() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [minOrderValue, setMinOrderValue] = useState(String(tailor.startingPrice));
  const [minLeadTime, setMinLeadTime] = useState('2 days');
  const [stitchDuration, setStitchDuration] = useState('3-4 days');
  const [deliveryDuration, setDeliveryDuration] = useState(String(tailor.deliveryDays));

  const onSave = () => {
    updateTailorProfile({ startingPrice: Number(minOrderValue) || tailor.startingPrice, deliveryDays: Number(deliveryDuration) || tailor.deliveryDays });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Settings" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input label="Minimum Order Value (₹)" keyboardType="number-pad" value={minOrderValue} onChangeText={setMinOrderValue} hint="Bookings below this amount won't be accepted" />
        <Input label="Minimum Lead Time" value={minLeadTime} onChangeText={setMinLeadTime} hint="e.g. 2 days — earliest you can start a new order" />
        <Input label="Estimated Stitching Duration" value={stitchDuration} onChangeText={setStitchDuration} hint="Typical time to complete stitching" />
        <Input label="Delivery Duration (days)" keyboardType="number-pad" value={deliveryDuration} onChangeText={setDeliveryDuration} hint="Typical time to hand over / deliver after completion" />
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
