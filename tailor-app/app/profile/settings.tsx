import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/Misc';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function OrderSettings() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [minOrderValue, setMinOrderValue] = useState(profile.minOrderValue);
  const [minLeadTime, setMinLeadTime] = useState(profile.minLeadTime);
  const [stitchDuration, setStitchDuration] = useState(profile.stitchDuration);
  const [deliveryDuration, setDeliveryDuration] = useState(profile.deliveryDuration);

  const onSave = () => {
    updateProfile({ minOrderValue, minLeadTime, stitchDuration, deliveryDuration });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Settings" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input label="Minimum Order Value (₹)" keyboardType="number-pad" value={minOrderValue} onChangeText={setMinOrderValue} hint="Bookings below this amount won't be accepted" />
        <Input label="Minimum Lead Time" value={minLeadTime} onChangeText={setMinLeadTime} hint="e.g. 2 days — earliest you can start a new order" />
        <Input label="Estimated Stitching Duration" value={stitchDuration} onChangeText={setStitchDuration} hint="Typical time to complete stitching" />
        <Input label="Delivery Duration" value={deliveryDuration} onChangeText={setDeliveryDuration} hint="Typical time to hand over / deliver after completion" />
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
