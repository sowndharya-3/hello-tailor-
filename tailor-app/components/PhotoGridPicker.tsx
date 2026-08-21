import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radii, spacing } from '@/theme';

export function PhotoGridPicker({ photos, onChange, max = 6 }: { photos: string[]; onChange: (p: string[]) => void; max?: number }) {
  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to upload shop/portfolio photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      onChange([...photos, result.assets[0].uri]);
    }
  };

  const remove = (uri: string) => onChange(photos.filter((p) => p !== uri));

  return (
    <View style={styles.grid}>
      {photos.map((uri) => (
        <View key={uri} style={styles.tile}>
          <Image source={{ uri }} style={styles.image} />
          <Pressable style={styles.removeBtn} onPress={() => remove(uri)}>
            <Ionicons name="close" size={14} color={colors.white} />
          </Pressable>
        </View>
      ))}
      {photos.length < max && (
        <Pressable style={styles.addTile} onPress={pick}>
          <Ionicons name="camera-outline" size={26} color={colors.ocean} />
          <Text style={styles.addText}>Add Photo</Text>
        </Pressable>
      )}
    </View>
  );
}

const TILE = 100;
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: TILE, height: TILE, borderRadius: radii.input, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  addTile: { width: TILE, height: TILE, borderRadius: radii.input, borderWidth: 1.5, borderColor: colors.ocean, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.infoBg },
  addText: { fontFamily: font.medium, fontSize: 11, color: colors.ocean, marginTop: 4 },
});
