// Ported from tailor-app/app/profile/location.tsx. address/landmark/pincode aren't on the
// shared Tailor type (only city/state/locality) — kept as local screen state, and only the
// overlapping fields (city, state, locality<-address) persist to the store.
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { LocationEditor, LocationValue } from '@/components/tailor/LocationEditor';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditLocation() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [value, setValue] = useState<LocationValue>({
    address: tailor.locality, landmark: '', city: tailor.city, state: tailor.state, pincode: '',
  });

  const onSave = () => {
    updateTailorProfile({ locality: value.address, city: value.city, state: value.state });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop Location" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LocationEditor value={value} onChange={setValue} onSave={onSave} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
});
