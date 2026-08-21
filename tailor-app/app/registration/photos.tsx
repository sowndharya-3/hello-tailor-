import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { PhotoGridPicker } from '@/components/PhotoGridPicker';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function PhotosStep() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const isShop = profile.tailorType === 'shop';
  const [photos, setPhotos] = useState<string[]>([]);

  const onNext = () => {
    updateProfile({ photos: photos.length ? photos : profile.photos });
    router.push('/registration/pending');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Shop & Portfolio Photos" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <StepProgress step={isShop ? 7 : 6} total={isShop ? 7 : 6} label="Photos" />
        <Text style={styles.helper}>Add photos of your {isShop ? 'shop and ' : ''}past work — this builds customer trust. (optional but recommended)</Text>
        <PhotoGridPicker photos={photos} onChange={setPhotos} />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Submit for Verification" onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
  helper: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: 18 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
