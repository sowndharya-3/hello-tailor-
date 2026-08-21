// Ported from tailor-app/app/profile/photos.tsx — persists into Tailor.gallery.
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { PhotoGridPicker } from '@/components/tailor/PhotoGridPicker';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditPhotos() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [photos, setPhotos] = useState<string[]>(tailor.gallery);

  const onSave = () => {
    updateTailorProfile({ gallery: photos });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop & Portfolio Photos" />
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
