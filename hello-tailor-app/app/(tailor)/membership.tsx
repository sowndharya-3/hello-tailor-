// Ported from tailor-app/app/membership.tsx — plans filtered to audience 'Tailor' from the
// shared data/seed membershipPlans; the shared Tailor type only tracks a `membership` name (no
// activePlan/planExpiry object), so the "active plan" card just shows the current tier.
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StatusPill } from '@/components/ui/Misc';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMyTailor, useStore } from '@/store/useStore';
import { membershipPlans } from '@/data/seed';
import type { MembershipPlan } from '@/store/types';
import { colors, font, radii, spacing } from '@/theme';

const tailorPlans = membershipPlans.filter((p: MembershipPlan) => p.audience === 'Tailor');

export default function Membership() {
  const tailor = useMyTailor();
  const buyPlan = useStore((s) => s.buyPlan);
  const [purchased, setPurchased] = useState(false);

  if (purchased) {
    return (
      <View style={styles.resultContainer}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultTitle}>Payment Successful</Text>
        <Text style={styles.resultSub}>Your membership is now active. Enjoy your new benefits!</Text>
        <Button label="Back to Profile" onPress={() => router.replace('/(tailor)/(tabs)/profile' as any)} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Tailor Membership" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {tailor.membership !== 'None' && (
          <Card style={styles.activeCard}>
            <View style={styles.row}>
              <Ionicons name="diamond" size={20} color={colors.gold} />
              <Text style={styles.activeLabel}>Active Plan: {tailor.membership}</Text>
            </View>
          </Card>
        )}

        {tailorPlans.map((plan) => {
          const isActive = tailor.membership === plan.name;
          return (
            <View key={plan.id} style={[styles.planCard, { borderColor: plan.color }]}>
              <View style={[styles.planHeader, { backgroundColor: plan.color }]}>
                <Text style={styles.planName}>{plan.name}</Text>
                {isActive && <StatusPill label="Current Plan" tone="success" />}
              </View>
              <View style={styles.planBody}>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{plan.price.toLocaleString('en-IN')}</Text>
                  <Text style={styles.duration}>/ {plan.duration}</Text>
                </View>
                {plan.benefits.map((b) => (
                  <View key={b} style={styles.benefitRow}>
                    <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}
                <Button
                  label={isActive ? 'Renew Plan' : 'Buy Plan'}
                  variant="gold"
                  onPress={() => {
                    Alert.alert('Confirm Purchase', `Buy the ${plan.name} plan for ₹${plan.price} / ${plan.duration}?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Pay & Activate', onPress: () => { buyPlan(plan); setPurchased(true); } },
                    ]);
                  }}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  activeCard: { backgroundColor: colors.goldLightBg, borderColor: '#F0DDAE', marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  activeLabel: { fontFamily: font.semibold, fontSize: 14, color: '#9C7523', marginLeft: 8 },
  planCard: { borderRadius: radii.premium, borderWidth: 1.5, marginBottom: spacing.lg, overflow: 'hidden', backgroundColor: colors.white },
  planHeader: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontFamily: font.bold, fontSize: 18, color: colors.white },
  planBody: { padding: spacing.lg },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md },
  price: { fontFamily: font.bold, fontSize: 26, color: colors.textPrimary },
  duration: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginLeft: 4, marginBottom: 4 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  benefitText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginLeft: 8, flex: 1 },
  resultContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  resultTitle: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary, marginTop: spacing.lg },
  resultSub: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
