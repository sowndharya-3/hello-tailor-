// Phase 7 — the "+" attachment sheet. Camera/Gallery pick a raw image via expo-image-picker
// (already a project dependency — used elsewhere for profile/shop photos); everything else is a
// pre-tagged PhotoType shortcut that still goes through gallery picking, just skips the "select
// photo type" step in ImagePreview since the intent is already known from which option was
// tapped.
import { Alert, Linking, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from '@/components/ui/BottomSheet';
import { colors, font, spacing } from '@/theme';
import type { PhotoType } from '@/store/chatTypes';

type Option = { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; photoType?: PhotoType; useCamera?: boolean };

// Step 7 — customer sends reference/cloth/measurement photos to the tailor; tailor sends
// progress/final-design photos back. Camera/Gallery stay generic entry points on both sides
// (they hand off to ImagePreview's own photo-type picker), everything else is a same-tap
// shortcut that pre-fills the type.
const CUSTOMER_OPTIONS: Option[] = [
  { key: 'camera', label: 'Camera', icon: 'camera-outline', useCamera: true },
  { key: 'gallery', label: 'Gallery', icon: 'images-outline' },
  { key: 'reference', label: 'Reference Design', icon: 'color-palette-outline', photoType: 'Reference Design' },
  { key: 'cloth', label: 'Cloth Photo', icon: 'shirt-outline', photoType: 'Cloth Photo' },
  { key: 'measurement', label: 'Measurement Reference', icon: 'resize-outline', photoType: 'Measurement Reference' },
];

const TAILOR_OPTIONS: Option[] = [
  { key: 'camera', label: 'Camera', icon: 'camera-outline', useCamera: true },
  { key: 'gallery', label: 'Gallery', icon: 'images-outline' },
  { key: 'progress', label: 'Progress Photo', icon: 'hourglass-outline', photoType: 'Progress Photo' },
  { key: 'final', label: 'Final Design', icon: 'checkmark-done-outline', photoType: 'Final Design' },
  { key: 'reference', label: 'Reference Design', icon: 'color-palette-outline', photoType: 'Reference Design' },
];

function showPermissionDeniedAlert(kind: 'Camera' | 'Photo Library') {
  Alert.alert(
    `${kind} access needed`,
    `Hello Tailor needs ${kind.toLowerCase()} access to attach photos to this chat. You can enable it in Settings.`,
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
}

export default function AttachmentBottomSheet({
  visible,
  onClose,
  onPicked,
  role = 'customer',
}: {
  visible: boolean;
  onClose: () => void;
  onPicked: (uri: string, suggestedType?: PhotoType) => void;
  role?: 'customer' | 'tailor';
}) {
  const options = role === 'tailor' ? TAILOR_OPTIONS : CUSTOMER_OPTIONS;

  const handlePick = async (opt: Option) => {
    // Step 9 — explicit permission check before launching, so a denial shows a clear recovery
    // action instead of the picker silently doing nothing (which reads as a broken button).
    if (opt.useCamera) {
      const current = await ImagePicker.getCameraPermissionsAsync();
      if (current.status !== 'granted') {
        const requested = await ImagePicker.requestCameraPermissionsAsync();
        if (requested.status !== 'granted') {
          onClose();
          showPermissionDeniedAlert('Camera');
          return;
        }
      }
    } else {
      const current = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (current.status !== 'granted') {
        const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (requested.status !== 'granted') {
          onClose();
          showPermissionDeniedAlert('Photo Library');
          return;
        }
      }
    }

    try {
      const result = opt.useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
      onClose();
      if (!result.canceled && result.assets?.[0]?.uri) {
        onPicked(result.assets[0].uri, opt.photoType);
      }
    } catch {
      onClose();
      Alert.alert("Couldn't open " + (opt.useCamera ? 'camera' : 'gallery'), 'Please try again.');
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add Attachment">
      <View style={styles.grid}>
        {options.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => handlePick(opt)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={opt.label}
          >
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
