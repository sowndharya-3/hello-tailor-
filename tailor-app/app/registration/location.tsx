import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress } from '@/components/ui/Misc';
import { LocationEditor, LocationValue } from '@/components/LocationEditor';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function LocationStep() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const isShop = profile.tailorType === 'shop';
  const [value, setValue] = useState<LocationValue>({ address: '', landmark: '', city: '', state: '', pincode: '' });

  const onSave = () => {
    updateProfile(value);
    router.push('/registration/services');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop Location" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StepProgress step={isShop ? 3 : 2} total={isShop ? 7 : 6} label="Location" />
        <LocationEditor value={value} onChange={setValue} onSave={onSave} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
});
