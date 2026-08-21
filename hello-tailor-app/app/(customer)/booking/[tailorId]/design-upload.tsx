import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StepProgress } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

export default function DesignUpload() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const updateBooking = useStore((s) => s.updateBooking);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');

  const pick = async (fromCamera: boolean) => {
    setUploadError('');
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setUploadError('Permission denied. Enable camera/gallery access in settings to upload design photos.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsMultipleSelection: true });
      if (!result.canceled) {
        const uris = result.assets.map((a) => a.uri);
        setPhotos((prev) => [...prev, ...uris].slice(0, 6));
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    }
  };

  const remove = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const submit = () => {
    updateBooking({ designPhotos: photos });
    router.push(`/booking/${tailorId}/measurement` as any);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Design Reference" subtitle="Optional but recommended" />
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <StepProgress step={4} total={11} label="Design Upload" />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <Text style={styles.hint}>Upload up to 6 reference photos (JPG/PNG, max 5MB each) to help the tailor understand your design.</Text>
        {uploadError ? <Text style={styles.error}>{uploadError}</Text> : null}

        <View style={styles.grid}>
          {photos.map((uri) => (
            <View key={uri} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable style={styles.removeBtn} onPress={() => remove(uri)}>
                <Ionicons name="close" size={14} color={colors.white} />
              </Pressable>
            </View>
          ))}
          {photos.length < 6 ? (
            <Pressable style={styles.addTile} onPress={() => pick(false)}>
              <Ionicons name="image-outline" size={22} color={colors.secondary} />
              <Text style={styles.addText}>Gallery</Text>
            </Pressable>
          ) : null}
        </View>

        <Pressable style={styles.cameraBtn} onPress={() => pick(true)}>
          <Ionicons name="camera-outline" size={20} color={colors.secondary} />
          <Text style={styles.cameraText}>Take a Photo</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Button label={photos.length ? 'Continue' : 'Skip for Now'} onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  footer: { paddingHorizontal: spacing.screenH, paddingTop: spacing.md, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  hint: { ...type.supporting, color: colors.textSecondary, marginBottom: spacing.lg },
  error: { ...type.supporting, color: colors.error, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: { width: 96, height: 96 },
  thumb: { width: 96, height: 96, borderRadius: radius.input },
  removeBtn: { position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' },
  addTile: { width: 96, height: 96, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addText: { ...type.supporting, color: colors.secondary },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: spacing.lg, paddingVertical: 14, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.secondary },
  cameraText: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
