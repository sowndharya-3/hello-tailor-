import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

const OPTIONS = [
  { id: 'home' as const, title: 'Home Tailor', desc: 'I work independently from home and visit or serve customers directly', icon: 'home-outline' as const },
  { id: 'shop' as const, title: 'Shop Tailor', desc: 'I run a tailoring shop with a physical storefront customers can visit', icon: 'storefront-outline' as const },
];

export default function TailorType() {
  const [selected, setSelected] = useState<'home' | 'shop' | null>(null);
  const updateProfile = useStore((s) => s.updateProfile);

  const onContinue = () => {
    if (!selected) return;
    updateProfile({ tailorType: selected });
    router.push('/registration/personal');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you work?</Text>
      <Text style={styles.subtitle}>This helps us customize your profile setup</Text>

      {OPTIONS.map((opt) => {
        const active = selected === opt.id;
        return (
          <Pressable key={opt.id} onPress={() => setSelected(opt.id)} style={[styles.card, active && styles.cardActive]}>
            <View style={[styles.iconWrap, active && { backgroundColor: colors.ocean }]}>
              <Ionicons name={opt.icon} size={26} color={active ? colors.white : colors.ocean} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.desc}</Text>
            </View>
            <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.ocean : colors.border} />
          </Pressable>
        );
      })}

      <Button label="Continue" onPress={onContinue} disabled={!selected} style={{ marginTop: spacing.xxl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 90 },
  title: { fontFamily: font.semibold, fontSize: 24, color: colors.textPrimary },
  subtitle: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: spacing.xxl },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.premium,
    borderWidth: 1.5, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.lg,
  },
  cardActive: { borderColor: colors.ocean, backgroundColor: colors.infoBg },
  iconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary },
  cardDesc: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },
});
