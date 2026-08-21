import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

// ponytail: no shared NavCard component exists yet in this app — kept local instead of
// adding a new shared file outside this screen's scope.
function NavRow({
  icon,
  label,
  sub,
  onPress,
  tone = 'default',
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
  tone?: 'default' | 'gold' | 'destructive';
  badge?: string;
}) {
  const iconBg = tone === 'gold' ? colors.goldLightBg : tone === 'destructive' ? '#FDEEEC' : colors.infoBg;
  const iconColor = tone === 'gold' ? colors.gold : tone === 'destructive' ? colors.error : colors.secondary;
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, tone === 'destructive' && { color: colors.error }]}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
    </Pressable>
  );
}

export default function ProfileTab() {
  const phone = useStore((s) => s.phone);
  const language = useStore((s) => s.language);
  const walletBalance = useStore((s) => s.walletBalance);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  const logout = useStore((s) => s.logout);
  const switchRole = useStore((s) => s.switchRole);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => {
    setConfirmOpen(false);
    logout();
    router.replace('/(auth)/login');
  };

  const doSwitchRole = () => {
    switchRole();
    router.replace('/role-select');
  };

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <Card style={{ marginHorizontal: spacing.screenH, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar name="Sowndharya Rajan" size={60} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Sowndharya Rajan</Text>
            <Text style={styles.meta}>+91 {phone || '98765 43210'}</Text>
            <Text style={styles.meta}>seoclaude011@gmail.com</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Account</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavRow icon="location-outline" label="Addresses" sub="Manage delivery & pickup addresses" onPress={() => router.push('/profile/addresses')} />
            <NavRow icon="people-outline" label="Family Members" sub="Book for family with saved details" onPress={() => router.push('/profile/family')} />
            <NavRow icon="resize-outline" label="Measurements" sub="View & manage saved measurements" onPress={() => router.push('/profile/measurements')} />
            <NavRow icon="receipt-outline" label="Orders" sub="Track and view order history" onPress={() => router.push('/bookings')} />
            <NavRow icon="wallet-outline" label="Payments & Wallet" sub={`Balance ₹${walletBalance}`} onPress={() => router.push('/profile/wallet')} />
            <NavRow icon="pricetag-outline" label="Offers & Coupons" onPress={() => router.push('/profile/offers')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Rewards</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavRow icon="ribbon-outline" label="Hello Tailor Membership" tone="gold" onPress={() => router.push('/profile/membership')} />
            <NavRow icon="star-outline" label="Loyalty Points" sub={`${loyaltyPoints} points available`} onPress={() => router.push('/profile/loyalty')} />
            <NavRow icon="gift-outline" label="Refer & Earn" onPress={() => router.push('/profile/referral')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Explore</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavRow icon="storefront-outline" label="Tailoring Material Store" badge="NEW" onPress={() => router.push('/store/material')} />
            <NavRow icon="shirt-outline" label="Readymade Dress Store" badge="NEW" onPress={() => router.push('/store/readymade')} />
            <NavRow icon="sparkles-outline" label="AI Design Suggestions" badge="BETA" onPress={() => router.push('/ai-design')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Support</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavRow icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/profile/support')} />
            <NavRow icon="alert-circle-outline" label="My Complaints" onPress={() => router.push('/profile/complaints')} />
            <NavRow icon="language-outline" label="Language" sub={language} onPress={() => router.push('/profile/language')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Session</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavRow icon="swap-horizontal-outline" label="Switch Role" sub="Go back to role selection" onPress={doSwitchRole} />
          </View>
        </Card>

        <View style={{ paddingHorizontal: spacing.screenH, marginTop: spacing.section }}>
          <Button label="Logout" variant="outline" onPress={() => setConfirmOpen(true)} />
        </View>
        <Text style={styles.version}>Hello Tailor v1.0.0</Text>
      </ScrollView>

      <Modal visible={confirmOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Logout?</Text>
            <Text style={styles.modalBody}>Are you sure you want to logout of Hello Tailor?</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setConfirmOpen(false)} />
              <Button label="Logout" variant="destructive" style={{ flex: 1 }} onPress={doLogout} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  title: { ...type.pageTitle, color: colors.text, paddingHorizontal: spacing.screenH, paddingTop: 12, paddingBottom: spacing.md },
  name: { ...type.cardTitle, color: colors.text },
  meta: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginLeft: spacing.screenH + 4, marginTop: spacing.section, marginBottom: 8 },
  version: { ...type.supporting, color: colors.disabledText, textAlign: 'center', marginTop: spacing.lg },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.screenH },
  modalCard: { width: '100%', backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.xl },
  modalTitle: { ...type.sectionHeading, color: colors.text },
  modalBody: { ...type.body, color: colors.textSecondary, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 38, height: 38, borderRadius: radius.input, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  rowSub: { ...type.supporting, color: colors.textSecondary, marginTop: 1 },
  badge: { backgroundColor: colors.gold, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  badgeText: { ...type.supporting, fontSize: 10, color: colors.white, fontFamily: 'Inter_600SemiBold' },
});
