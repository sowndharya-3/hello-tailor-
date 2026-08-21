// Ported from tailor-app/app/(tabs)/profile.tsx — rewired to useMyTailor(); profileCompletion()
// was a store selector in the source app, computed inline here from shared Tailor fields since
// the shared store doesn't carry a dedicated selector for it. "Edit Shop Details" replaces the
// old pre-login registration stepper (see profile/edit.tsx) since role-select already happened.
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/Misc';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

function Row({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.ocean} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function Profile() {
  const tailor = useMyTailor();
  const switchRole = useStore((s) => s.switchRole);
  const logout = useStore((s) => s.logout);

  const completion = Math.round(
    ([
      !!tailor.about,
      tailor.gallery.length > 0,
      tailor.categories.length > 0,
      tailor.services.length > 0,
      !!tailor.locality,
      tailor.experienceYears > 0,
    ].filter(Boolean).length / 6) * 100
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.cover}>
        <Image source={{ uri: tailor.cover }} style={StyleSheet.absoluteFill} />
        <View style={styles.coverOverlay} />
        <Image source={require('@/assets/images/hello-tailor-logo.png')} style={styles.logoBadge} resizeMode="contain" />
      </View>

      <View style={styles.profileBlock}>
        <Image source={{ uri: tailor.image }} style={styles.avatar} />
        <Text style={styles.name}>{tailor.name}</Text>
        <Text style={styles.shop}>{tailor.shopName}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          {tailor.verified && <StatusPill label="Verified" tone="success" icon="shield-checkmark-outline" />}
          {tailor.membership !== 'None' && <StatusPill label={`${tailor.membership} Member`} tone="gold" icon="diamond-outline" />}
        </View>
      </View>

      <View style={styles.body}>
        <Card>
          <View style={styles.completionHeader}>
            <Text style={styles.completionLabel}>Profile completion</Text>
            <Text style={styles.completionPct}>{completion}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.about}>{tailor.about}</Text>
          <View style={styles.metaGrid}>
            <MetaItem label="Experience" value={`${tailor.experienceYears} yrs`} />
            <MetaItem label="Starting at" value={`₹${tailor.startingPrice}`} />
            <MetaItem label="Delivery" value={`${tailor.deliveryDays} days`} />
          </View>
        </Card>

        <Text style={styles.section}>Shop Profile</Text>
        <Card noPadding>
          <Row icon="create-outline" label="Edit Shop Details" onPress={() => router.push('/(tailor)/profile/edit' as any)} />
          <Row icon="location-outline" label="Shop Location" onPress={() => router.push('/(tailor)/profile/location' as any)} />
          <Row icon="time-outline" label="Working Hours" onPress={() => router.push('/(tailor)/profile/hours' as any)} />
          <Row icon="pricetags-outline" label="Stitching Categories" onPress={() => router.push('/(tailor)/profile/categories' as any)} />
          <Row icon="cash-outline" label="Price List" onPress={() => router.push('/(tailor)/profile/pricing' as any)} />
          <Row icon="options-outline" label="Order Settings" onPress={() => router.push('/(tailor)/profile/settings' as any)} />
          <Row icon="images-outline" label="Shop & Portfolio Photos" onPress={() => router.push('/(tailor)/profile/photos' as any)} />
        </Card>

        <Text style={styles.section}>Grow Your Business</Text>
        <Card noPadding>
          <Row icon="diamond-outline" label="Membership Plans" onPress={() => router.push('/(tailor)/membership' as any)} />
          <Row icon="megaphone-outline" label="Advertise Your Shop" onPress={() => router.push('/(tailor)/advertise' as any)} />
          <Row icon="star-outline" label="Featured Listing" onPress={() => router.push('/(tailor)/featured' as any)} />
          <Row icon="chatbubble-ellipses-outline" label="Customer Reviews" onPress={() => router.push('/(tailor)/reviews' as any)} />
        </Card>

        <Text style={styles.section}>Categories You Offer</Text>
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tailor.categories.map((name) => (
              <StatusPill key={name} label={name} tone="info" />
            ))}
          </View>
        </Card>

        <Pressable style={styles.switchRole} onPress={switchRole}>
          <Ionicons name="swap-horizontal-outline" size={18} color={colors.ocean} />
          <Text style={styles.switchRoleText}>Switch Role</Text>
        </Pressable>
        <Pressable style={styles.logout} onPress={() => { logout(); router.replace('/(auth)/login' as any); }}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: { height: 130, backgroundColor: colors.navy },
  coverOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(23,59,87,0.35)' },
  logoBadge: { position: 'absolute', top: 50, left: spacing.lg, height: 26, width: 100 },
  profileBlock: { alignItems: 'center', marginTop: -44 },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: colors.white },
  name: { fontFamily: font.semibold, fontSize: 19, color: colors.textPrimary, marginTop: spacing.sm },
  shop: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  body: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  completionLabel: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary },
  completionPct: { fontFamily: font.semibold, fontSize: 13, color: colors.ocean },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.success },
  about: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
  metaGrid: { flexDirection: 'row', marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  metaValue: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  metaLabel: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  section: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  rowLabel: { flex: 1, fontFamily: font.medium, fontSize: 14, color: colors.textPrimary },
  switchRole: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl, paddingVertical: 14 },
  switchRoleText: { fontFamily: font.semibold, fontSize: 14, color: colors.ocean, marginLeft: 8 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  logoutText: { fontFamily: font.semibold, fontSize: 14, color: colors.error, marginLeft: 8 },
});
