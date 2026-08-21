import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '@/theme';
// ponytail: useStore doesn't actually re-export membershipPlans (only ME_CUSTOMER/ME_TAILOR_ID
// are re-exported) — importing straight from data/seed, which is the real source.
import { membershipPlans } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';

// ponytail: no store action exists to "buy" a customer membership (buyPlan mutates the
// tailor's membership, not the customer's) — this just shows a local confirmation, no
// persisted state. Add a customer-membership field to the store if this needs to stick.
const customerPlans = membershipPlans.filter((p) => p.audience === 'Customer');

export default function Membership() {
  const [active, setActive] = useState(false);
  const [planId, setPlanId] = useState(customerPlans[0]?.id);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Hello Tailor Membership" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.hero}>
          <Ionicons name="ribbon" size={40} color={colors.gold} />
          <Text style={styles.heroTitle}>Hello Tailor Gold</Text>
          <Text style={styles.heroSub}>
            {active ? 'Your membership is active until 20 Nov 2026' : 'Unlock premium perks on every order'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Benefits</Text>
        {['Free pickup & delivery on every order', 'Up to 15% off stitching charges', 'Priority stitching slots', '2 free alterations every month', 'Early access to new tailors'].map((b) => (
          <View key={b} style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.gold} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Choose a Plan</Text>
        {customerPlans.map((p) => {
          const isSelected = planId === p.id;
          return (
            <Pressable key={p.id} style={[styles.planCard, isSelected && styles.planCardActive]} onPress={() => setPlanId(p.id)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.planName}>{p.name}</Text>
                <Text style={styles.planPrice}>₹{p.price}</Text>
              </View>
              <Text style={styles.planDuration}>{p.duration}</Text>
              {p.benefits.map((b) => <Text key={b} style={styles.planBenefit}>• {b}</Text>)}
            </Pressable>
          );
        })}

        <Button
          label={active ? 'Renew Membership' : 'Activate Membership'}
          variant="gold"
          style={{ marginTop: spacing.lg }}
          onPress={() => {
            setActive(true);
            Alert.alert('Subscribed!', 'Welcome to Hello Tailor Gold!');
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.premium, padding: spacing.xl, gap: 6 },
  heroTitle: { ...type.pageTitle, fontSize: 22, color: colors.white, marginTop: 4 },
  heroSub: { ...type.body, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  sectionTitle: { ...type.sectionHeading, color: colors.text, marginTop: spacing.section, marginBottom: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  benefitText: { ...type.body, color: colors.text, flex: 1 },
  planCard: { backgroundColor: colors.card, borderRadius: radius.premium, borderWidth: 1.5, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.md },
  planCardActive: { borderColor: colors.gold, backgroundColor: colors.goldLightBg },
  planName: { ...type.cardTitle, color: colors.text },
  planPrice: { ...type.cardTitle, color: colors.gold },
  planDuration: { ...type.supporting, color: colors.textSecondary, marginTop: 2, marginBottom: 8 },
  planBenefit: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
});
