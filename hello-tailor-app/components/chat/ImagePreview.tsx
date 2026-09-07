// Phase 8 — shown before an image is ever sent. Full crop tooling is out of scope for a
// frontend prototype with no image-processing backend (noted here rather than silently
// skipped) — "Crop" re-opens the picker's own crop step (expo-image-picker's allowsEditing,
// already invoked in AttachmentBottomSheet) via onReplace, which is the same effect a user
// wants ("let me adjust the crop") without building a second cropping surface.
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { colors, font, radius, spacing } from '@/theme';
import type { PhotoType } from '@/store/chatTypes';

const PHOTO_TYPES: PhotoType[] = ['Reference Design', 'Cloth Photo', 'Measurement Reference', 'Progress Photo', 'Final Design', 'Other'];

export default function ImagePreview({
  uri,
  initialPhotoType,
  onReplace,
  onRemove,
  onSend,
}: {
  uri: string;
  initialPhotoType?: PhotoType;
  onReplace: () => void;
  onRemove: () => void;
  onSend: (caption: string, photoType: PhotoType) => void;
}) {
  const [caption, setCaption] = useState('');
  const [photoType, setPhotoType] = useState<PhotoType>(initialPhotoType ?? 'Reference Design');

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={26} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={{ width: 26 }} />
      </View>

      <Image source={{ uri }} style={styles.image} resizeMode="contain" />

      <View style={styles.actionsRow}>
        <Pressable onPress={onReplace} style={styles.actionBtn}>
          <Ionicons name="crop-outline" size={18} color={colors.white} />
          <Text style={styles.actionText}>Crop / Replace</Text>
        </Pressable>
        <Pressable onPress={onRemove} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.white} />
          <Text style={styles.actionText}>Remove</Text>
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.label}>Photo Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: spacing.md }}>
          {PHOTO_TYPES.map((t) => (
            <Pressable key={t} onPress={() => setPhotoType(t)} style={[styles.typeChip, photoType === t && styles.typeChipActive]}>
              <Text style={[styles.typeChipText, photoType === t && styles.typeChipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Add Caption</Text>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Write a note about this photo..."
          placeholderTextColor={colors.disabledText}
          style={styles.captionInput}
          multiline
        />

        <Button label="Send" onPress={() => onSend(caption.trim(), photoType)} style={{ marginTop: spacing.sm }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0B0D10' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 54, paddingBottom: spacing.md },
  headerTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
  image: { flex: 1, width: '100%' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: font.medium, fontSize: 12.5, color: colors.white },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, padding: spacing.lg },
  label: { fontFamily: font.medium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 8 },
  typeChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  typeChipText: { fontFamily: font.medium, fontSize: 12.5, color: colors.text },
  typeChipTextActive: { color: colors.white },
  captionInput: { minHeight: 60, borderRadius: radius.input, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 10, fontFamily: font.regular, fontSize: 14, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.md },
});
