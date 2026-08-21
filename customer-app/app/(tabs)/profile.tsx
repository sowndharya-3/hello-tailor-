import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import NavCard from '../../components/NavCard';
import Button from '../../components/ui/Button';
import { useApp } from '../../store/AppState';

export default function ProfileTab() {
  const { phone, logout, language } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => {
    setConfirmOpen(false);
    logout();
    router.replace('/(auth)/login');
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
            <NavCard icon="location-outline" label="Addresses" sub="Manage delivery & pickup addresses" onPress={() => router.push('/profile/addresses')} />
            <NavCard icon="people-outline" label="Family Members" sub="Book for family with saved details" onPress={() => router.push('/profile/family')} />
            <NavCard icon="resize-outline" label="Measurements" sub="View & manage saved measurements" onPress={() => router.push('/profile/measurements')} />
            <NavCard icon="receipt-outline" label="Orders" sub="Track and view order history" onPress={() => router.push('/(tabs)/bookings')} />
            <NavCard icon="wallet-outline" label="Payments & Wallet" sub={`Balance ₹340`} onPress={() => router.push('/profile/wallet')} />
            <NavCard icon="pricetag-outline" label="Offers & Coupons" onPress={() => router.push('/profile/offers')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Rewards</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavCard icon="ribbon-outline" label="Hello Tailor Membership" tone="gold" onPress={() => router.push('/profile/membership')} />
            <NavCard icon="star-outline" label="Loyalty Points" sub="620 points available" onPress={() => router.push('/profile/loyalty')} />
            <NavCard icon="gift-outline" label="Refer & Earn" onPress={() => router.push('/profile/referral')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Explore</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavCard icon="storefront-outline" label="Tailoring Material Store" badge="NEW" onPress={() => router.push('/store/material')} />
            <NavCard icon="shirt-outline" label="Readymade Dress Store" badge="NEW" onPress={() => router.push('/store/readymade')} />
            <NavCard icon="sparkles-outline" label="AI Design Suggestions" badge="BETA" onPress={() => router.push('/ai-design')} />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Support</Text>
        <Card style={{ marginHorizontal: spacing.screenH }} noPadding>
          <View style={{ paddingHorizontal: spacing.cardInner }}>
            <NavCard icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/profile/support')} />
            <NavCard icon="alert-circle-outline" label="My Complaints" onPress={() => router.push('/profile/complaints')} />
            <NavCard icon="language-outline" label="Language" sub={language} onPress={() => router.push('/profile/language')} />
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
});
