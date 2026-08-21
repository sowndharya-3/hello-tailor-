// NEW screen (no direct tailor-app source file). tailor-app's registration/ stepper
// (personal -> shop -> services -> pricing -> hours -> location -> photos -> pending -> success)
// is pre-login onboarding there; here login + role-select already happened before this route
// group loads, so its one genuinely reusable step — editing the core shop identity fields
// (name/shopName/about/experience/photo/cover) — is exposed here from Profile instead of
// gating the whole tailor role behind a multi-step wizard. Categories/hours/pricing/location
// already have their own dedicated editors (see the other profile/*.tsx screens).
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
  return !result.canceled && result.assets[0] ? result.assets[0].uri : null;
}

export default function EditShopDetails() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [name, setName] = useState(tailor.name);
  const [shopName, setShopName] = useState(tailor.shopName);
  const [about, setAbout] = useState(tailor.about);
  const [experienceYears, setExperienceYears] = useState(String(tailor.experienceYears));
  const [image, setImage] = useState(tailor.image);
  const [cover, setCover] = useState(tailor.cover);

  const onSave = () => {
    updateTailorProfile({ name, shopName, about, experienceYears: Number(experienceYears) || tailor.experienceYears, image, cover });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Shop Details" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.coverWrap} onPress={async () => { const uri = await pickImage(); if (uri) setCover(uri); }}>
          <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} />
          <View style={styles.coverOverlay}>
            <Ionicons name="camera-outline" size={20} color={colors.white} />
            <Text style={styles.coverText}>Change Cover</Text>
          </View>
        </Pressable>
        <Pressable style={styles.avatarWrap} onPress={async () => { const uri = await pickImage(); if (uri) setImage(uri); }}>
          <Image source={{ uri: image }} style={styles.avatar} />
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={13} color={colors.white} />
          </View>
        </Pressable>

        <Input label="Your Name" value={name} onChangeText={setName} placeholder="Full name" />
        <Input label="Shop Name" value={shopName} onChangeText={setShopName} placeholder="Business name" />
        <Input label="Experience (years)" value={experienceYears} onChangeText={setExperienceYears} keyboardType="number-pad" />
        <Input label="About" value={about} onChangeText={setAbout} placeholder="Tell customers about your work" multiline numberOfLines={4} />
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
  coverWrap: { height: 130, borderRadius: radii.card, overflow: 'hidden', marginBottom: 44, backgroundColor: colors.disabledBg },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(23,59,87,0.35)', alignItems: 'center', justifyContent: 'center' },
  coverText: { fontFamily: font.medium, fontSize: 12, color: colors.white, marginTop: 4 },
  avatarWrap: { position: 'absolute', top: 95, left: spacing.xl },
  avatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: colors.white },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.ocean, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
