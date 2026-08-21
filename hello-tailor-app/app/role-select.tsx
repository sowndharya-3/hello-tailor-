import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius, shadow } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Role } from '@/store/types';

const ROLES: { role: Role; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; tone: string }[] = [
  { role: 'customer', title: "I'm a Customer", subtitle: 'Book tailors, track orders & shop', icon: 'shirt-outline', tone: colors.secondary },
  { role: 'tailor', title: "I'm a Tailor", subtitle: 'Manage bookings, orders & income', icon: 'cut-outline', tone: colors.gold },
  { role: 'admin', title: "I'm an Admin", subtitle: 'Manage the whole platform', icon: 'shield-checkmark-outline', tone: colors.primary },
];

export default function RoleSelect() {
  const selectRole = useStore((s) => s.selectRole);

  const choose = (role: Role) => {
    selectRole(role);
    router.replace(`/(${role})` as any);
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 48 }}>
      <View style={{ alignItems: 'center', marginTop: 32, marginBottom: spacing.xl }}>
        <Image source={require('../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>How would you like to continue?</Text>
        <Text style={styles.subtitle}>You can switch roles anytime from your profile menu</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.screenH, gap: spacing.md }}>
        {ROLES.map((r) => (
          <Pressable key={r.role} onPress={() => choose(r.role)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
            <View style={[styles.iconWrap, { backgroundColor: r.tone + '1A' }]}>
              <Ionicons name={r.icon} size={26} color={r.tone} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  logo: { width: 96, height: 96, marginBottom: spacing.md },
  title: { ...type.sectionHeading, color: colors.text, textAlign: 'center', paddingHorizontal: 32 },
  subtitle: { ...type.supporting, color: colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.premium,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.card,
  },
  iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { ...type.cardTitle, color: colors.text },
  cardSubtitle: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
});
