import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { PhotoGridPicker } from '@/components/PhotoGridPicker';
import { useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditPhotos() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [photos, setPhotos] = useState<string[]>(profile.photos);

  const onSave = () => {
    updateProfile({ photos });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop & Portfolio Photos" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <PhotoGridPicker photos={photos} onChange={setPhotos} max={9} />
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
