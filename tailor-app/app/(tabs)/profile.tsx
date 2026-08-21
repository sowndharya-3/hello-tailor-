import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/Misc';
import { CATEGORIES } from '@/data/categories';
import { useStore } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

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
  const profile = useStore((s) => s.profile);
  const completion = useStore((s) => s.profileCompletion());

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.cover}>
        <Image source={{ uri: profile.coverUrl }} style={StyleSheet.absoluteFill} />
        <View style={styles.coverOverlay} />
        <View style={styles.logoBadge}><Logo height={26} /></View>
      </View>

      <View style={styles.profileBlock}>
        <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.shop}>{profile.shopName}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          {profile.verified && <StatusPill label="Verified" tone="success" icon="shield-checkmark-outline" />}
          {profile.activePlan && <StatusPill label={`${profile.activePlan.name} Member`} tone="gold" icon="diamond-outline" />}
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
          <Text style={styles.about}>{profile.about}</Text>
          <View style={styles.metaGrid}>
            <MetaItem label="Experience" value={`${profile.experience} yrs`} />
            <MetaItem label="Min. Order" value={`₹${profile.minOrderValue}`} />
            <MetaItem label="Delivery" value={profile.deliveryDuration} />
          </View>
        </Card>

        <Text style={styles.section}>Business Settings</Text>
        <Card padded={false}>
          <Row icon="location-outline" label="Shop Location" onPress={() => router.push('/profile/location')} />
          <Row icon="time-outline" label="Working Hours" onPress={() => router.push('/profile/hours')} />
          <Row icon="pricetags-outline" label="Stitching Categories" onPress={() => router.push('/profile/categories')} />
          <Row icon="cash-outline" label="Price List" onPress={() => router.push('/profile/pricing')} />
          <Row icon="options-outline" label="Order Settings" onPress={() => router.push('/profile/settings')} />
          <Row icon="images-outline" label="Shop & Portfolio Photos" onPress={() => router.push('/profile/photos')} />
        </Card>

        <Text style={styles.section}>Grow Your Business</Text>
        <Card padded={false}>
          <Row icon="diamond-outline" label="Membership Plans" onPress={() => router.push('/membership')} />
          <Row icon="megaphone-outline" label="Advertise Your Shop" onPress={() => router.push('/advertise')} />
          <Row icon="star-outline" label="Featured Listing" onPress={() => router.push('/featured')} />
          <Row icon="chatbubble-ellipses-outline" label="Customer Reviews" onPress={() => router.push('/reviews')} />
        </Card>

        <Text style={styles.section}>Categories You Offer</Text>
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {profile.categories.map((id) => {
              const cat = CATEGORIES.find((c) => c.id === id);
              return <StatusPill key={id} label={cat?.name ?? id} tone="info" />;
            })}
          </View>
        </Card>

        <Pressable style={styles.logout} onPress={() => router.replace('/(auth)/login')}>
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
  logoBadge: { position: 'absolute', top: 50, left: spacing.lg, backgroundColor: colors.white, borderRadius: 20, padding: 6 },
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
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl, paddingVertical: 14 },
  logoutText: { fontFamily: font.semibold, fontSize: 14, color: colors.error, marginLeft: 8 },
});
