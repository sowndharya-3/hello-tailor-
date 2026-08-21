// Ported from tailor-app/app/featured.tsx — the shared Tailor type DOES have a `featured`
// boolean (unlike activeAd/activePlan-expiry, which don't exist), so purchase just flips it via
// updateTailorProfile (no dedicated buyFeatured action in the shared store).
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

const OPTIONS = [
  { days: 7, price: 349 },
  { days: 15, price: 599 },
  { days: 30, price: 999 },
];

export default function Featured() {
  const tailor = useMyTailor();
  const updateTailorProfile = useStore((s) => s.updateTailorProfile);
  const [selected, setSelected] = useState(OPTIONS[1]);
  const [purchased, setPurchased] = useState(false);

  if (purchased) {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultTitle}>You're Featured!</Text>
        <Text style={styles.resultSub}>Your profile now shows the Featured badge and gets priority placement.</Text>
        <Button label="Back to Profile" onPress={() => router.replace('/(tailor)/(tabs)/profile' as any)} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Featured Listing" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Ionicons name="star" size={30} color={colors.white} />
          <Text style={styles.heroTitle}>Get Seen First</Text>
          <Text style={styles.heroSub}>Featured shops appear at the top of category search results with a gold badge, boosting visibility by up to 3x.</Text>
        </View>

        {tailor.featured && (
          <Card style={styles.activeCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={18} color={colors.gold} />
              <Text style={styles.activeLabel}>Featured Active</Text>
            </View>
          </Card>
        )}

        <Text style={styles.section}>Choose Duration</Text>
        <View style={styles.optionsRow}>
          {OPTIONS.map((opt) => {
            const active = opt.days === selected.days;
            return (
              <View
                key={opt.days}
                style={[styles.optionCard, active && styles.optionCardActive]}
                onTouchEnd={() => setSelected(opt)}
              >
                <Text style={[styles.optionDays, active && styles.optionTextActive]}>{opt.days} days</Text>
                <Text style={[styles.optionPrice, active && styles.optionTextActive]}>₹{opt.price}</Text>
              </View>
            );
          })}
        </View>

        <Card>
          <Text style={styles.section}>What you get</Text>
          {['Gold "Featured" badge on your profile', 'Top placement in category search', 'Highlighted card on customer home screen'].map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
          <Button
            label={`Pay ₹${selected.price} & Go Featured`}
            variant="gold"
            onPress={() => Alert.alert('Confirm Payment', `Activate Featured listing for ${selected.days} days at ₹${selected.price}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Pay Now', onPress: () => { updateTailorProfile({ featured: true }); setPurchased(true); } },
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
  hero: { backgroundColor: colors.navy, borderRadius: radii.premium, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  heroTitle: { fontFamily: font.bold, fontSize: 20, color: colors.white, marginTop: spacing.sm },
  heroSub: { fontFamily: font.regular, fontSize: 13, color: '#C9D8E3', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  activeCard: { backgroundColor: colors.goldLightBg, borderColor: '#F0DDAE', marginBottom: spacing.lg },
  activeLabel: { fontFamily: font.semibold, fontSize: 14, color: '#9C7523', marginLeft: 8 },
  section: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary, marginBottom: spacing.md },
  optionsRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  optionCard: { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.input, paddingVertical: 14, alignItems: 'center', backgroundColor: colors.white },
  optionCardActive: { borderColor: colors.gold, backgroundColor: colors.goldLightBg },
  optionDays: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  optionPrice: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  optionTextActive: { color: '#9C7523' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  benefitText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginLeft: 8, flex: 1 },
  resultContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  resultTitle: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary, marginTop: spacing.lg },
  resultSub: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
