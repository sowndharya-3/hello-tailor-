// Phase 7 — the "+" attachment sheet. Camera/Gallery pick a raw image via expo-image-picker
// (already a project dependency — used elsewhere for profile/shop photos); everything else is a
// pre-tagged PhotoType shortcut that still goes through gallery picking, just skips the "select
// photo type" step in ImagePreview since the intent is already known from which option was
// tapped.
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from '@/components/ui/BottomSheet';
import { colors, font, spacing } from '@/theme';
import type { PhotoType } from '@/store/chatTypes';

type Option = { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; photoType?: PhotoType; useCamera?: boolean };

const OPTIONS: Option[] = [
  { key: 'camera', label: 'Camera', icon: 'camera-outline', useCamera: true },
  { key: 'gallery', label: 'Gallery', icon: 'images-outline' },
  { key: 'reference', label: 'Reference Design', icon: 'color-palette-outline', photoType: 'Reference Design' },
  { key: 'cloth', label: 'Cloth Photo', icon: 'shirt-outline', photoType: 'Cloth Photo' },
  { key: 'measurement', label: 'Measurement Reference', icon: 'resize-outline', photoType: 'Measurement Reference' },
  { key: 'document', label: 'Document', icon: 'document-text-outline', photoType: 'Other' },
];

export default function AttachmentBottomSheet({
  visible,
  onClose,
  onPicked,
}: {
  visible: boolean;
  onClose: () => void;
  onPicked: (uri: string, suggestedType?: PhotoType) => void;
}) {
  const handlePick = async (opt: Option) => {
    const result = opt.useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    onClose();
    if (!result.canceled && result.assets?.[0]?.uri) {
      onPicked(result.assets[0].uri, opt.photoType);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add Attachment">
      <View style={styles.grid}>
        {OPTIONS.map((opt) => (
          <Pressable key={opt.key} onPress={() => handlePick(opt)} style={styles.item}>
            <View style={styles.iconWrap}>
              <Ionicons name={opt.icon} size={24} color={colors.secondary} />
            </View>
            <Text style={styles.label}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingBottom: spacing.sm },
  item: { width: '30%', alignItems: 'center', gap: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: font.medium, fontSize: 11.5, color: colors.text, textAlign: 'center' },
});
