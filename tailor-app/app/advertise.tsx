import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, StatusPill } from '@/components/ui/Misc';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { adPlacements } from '@/data/mockData';
import { colors, font, radii, spacing } from '@/theme';

export default function Advertise() {
  const profile = useStore((s) => s.profile);
  const buyAd = useStore((s) => s.buyAd);
  const [selected, setSelected] = useState(adPlacements[0].id);
  const [purchased, setPurchased] = useState(false);

  const plan = adPlacements.find((p) => p.id === selected)!;

  if (purchased) {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultTitle}>Ad Campaign Live!</Text>
        <Text style={styles.resultSub}>Your "{plan.name}" placement is now active for {plan.duration}.</Text>
        <Button label="Back to Profile" onPress={() => router.replace('/(tabs)/profile')} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Advertise Your Shop" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {profile.activeAd && (
          <Card style={styles.activeCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="megaphone" size={18} color={colors.gold} />
              <Text style={styles.activeLabel}>Active: {profile.activeAd.placement}</Text>
            </View>
            <Text style={styles.activeExpiry}>Runs until {new Date(profile.activeAd.expiry).toLocaleDateString('en-IN')}</Text>
          </Card>
        )}

        <Text style={styles.section}>Available Placements</Text>
        {adPlacements.map((p) => {
          const active = p.id === selected;
          return (
            <Pressable key={p.id} onPress={() => setSelected(p.id)}>
              <Card style={[styles.placementCard, active && styles.placementCardActive]}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.placementName}>{p.name}</Text>
                    <Text style={styles.placementDesc}>{p.description}</Text>
                  </View>
                  <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.ocean : colors.border} />
                </View>
                <View style={styles.row}>
                  <Text style={styles.placementPrice}>₹{p.price}</Text>
                  <Text style={styles.placementDuration}> / {p.duration}</Text>
                </View>
              </Card>
            </Pressable>
          );
        })}

        <Text style={styles.section}>Preview</Text>
        <Card style={styles.previewCard}>
          <Image source={{ uri: `https://picsum.photos/seed/${profile.shopName}/600/240` }} style={styles.previewImage} />
          <View style={styles.previewOverlay}>
            <StatusPill label="Sponsored" tone="gold" />
            <Text style={styles.previewShop}>{profile.shopName}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Payment</Text>
          <View style={styles.row}>
            <Text style={styles.payLabel}>Placement</Text>
            <Text style={styles.payValue}>{plan.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.payLabel}>Total</Text>
            <Text style={styles.payTotal}>₹{plan.price}</Text>
          </View>
          <Button
            label={`Pay ₹${plan.price} & Activate`}
            variant="gold"
            onPress={() => Alert.alert('Confirm Payment', `Activate ${plan.name} for ${plan.duration}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Pay Now', onPress: () => { buyAd(plan.name, 7); setPurchased(true); } },
            ])}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  activeCard: { backgroundColor: colors.goldLightBg, borderColor: '#F0DDAE', marginBottom: spacing.lg },
  activeLabel: { fontFamily: font.semibold, fontSize: 14, color: '#9C7523', marginLeft: 8 },
  activeExpiry: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4, marginLeft: 26 },
  section: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  placementCard: { marginBottom: spacing.md, borderWidth: 1.5 },
  placementCardActive: { borderColor: colors.ocean, backgroundColor: colors.infoBg },
  placementName: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary },
  placementDesc: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  placementPrice: { fontFamily: font.bold, fontSize: 16, color: colors.textPrimary, marginTop: spacing.sm },
  placementDuration: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm },
  previewCard: { padding: 0, overflow: 'hidden', marginBottom: spacing.lg },
  previewImage: { width: '100%', height: 140 },
  previewOverlay: { padding: spacing.md },
  previewShop: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary, marginTop: 6 },
  payLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginVertical: 4 },
  payValue: { fontFamily: font.medium, fontSize: 13, color: colors.textPrimary },
  payTotal: { fontFamily: font.bold, fontSize: 18, color: colors.textPrimary },
  resultContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  resultTitle: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary, marginTop: spacing.lg },
  resultSub: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
