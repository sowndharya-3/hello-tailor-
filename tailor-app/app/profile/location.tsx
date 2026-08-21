import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/Misc';
import { LocationEditor, LocationValue } from '@/components/LocationEditor';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditLocation() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [value, setValue] = useState<LocationValue>({
    address: profile.address, landmark: profile.landmark, city: profile.city, state: profile.state, pincode: profile.pincode,
  });

  const onSave = () => {
    updateProfile(value);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop Location" onBack={() => router.back()} />
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
