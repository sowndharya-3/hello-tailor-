// Ported from customer-app/app/profile/support/index.tsx — faqs now come from the shared seed.
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { faqs } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';

function NavRow({ icon, label, sub, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; onPress: () => void }) {
  return (
    <Pressable style={styles.navRow} onPress={onPress}>
      <View style={styles.navIcon}>
        <Ionicons name={icon} size={20} color={colors.secondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.navLabel}>{label}</Text>
        <Text style={styles.navSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
    </Pressable>
  );
}

export default function Support() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Help & Support" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.card}>
          <NavRow icon="chatbubbles-outline" label="Support Chat" sub="Chat with our team, usually replies in minutes" onPress={() => router.push('/(customer)/profile/support/chat')} />
          <NavRow icon="call-outline" label="Call Support" sub="+91 44 4567 8901" onPress={() => Linking.openURL('tel:+914445678901')} />
          <NavRow icon="mail-outline" label="Email Support" sub="support@hellotailor.in" onPress={() => Linking.openURL('mailto:support@hellotailor.in')} />
          <NavRow icon="alert-circle-outline" label="Raise a Ticket" sub="Report an order issue" onPress={() => router.push('/(customer)/profile/complaints/new')} />
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((f, i) => {
          const open = openIdx === i;
          return (
            <Pressable key={f.q} style={styles.faqCard} onPress={() => setOpenIdx(open ? null : i)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
              </View>
              {open ? <Text style={styles.faqA}>{f.a}</Text> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.cardInner, marginBottom: spacing.section },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  navIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  navLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  navSub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { ...type.sectionHeading, color: colors.text, marginBottom: spacing.md },
  faqCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: 10 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { flex: 1, ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginRight: 8 },
  faqA: { ...type.body, color: colors.textSecondary, marginTop: 10 },
});
