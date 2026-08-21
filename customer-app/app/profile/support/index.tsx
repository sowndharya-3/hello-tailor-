import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { faqs } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import NavCard from '../../../components/NavCard';

export default function Support() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Help & Support" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.card}>
          <NavCard icon="chatbubbles-outline" label="Support Chat" sub="Chat with our team, usually replies in minutes" onPress={() => router.push('/profile/support/chat')} />
          <NavCard icon="call-outline" label="Call Support" sub="+91 44 4567 8901" onPress={() => Linking.openURL('tel:+914445678901')} />
          <NavCard icon="mail-outline" label="Email Support" sub="support@hellotailor.in" onPress={() => Linking.openURL('mailto:support@hellotailor.in')} />
          <NavCard icon="alert-circle-outline" label="Raise a Ticket" sub="Report an order issue" onPress={() => router.push('/profile/complaints/new')} />
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
  sectionTitle: { ...type.sectionHeading, color: colors.text, marginBottom: spacing.md },
  faqCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: 10 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { flex: 1, ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginRight: 8 },
  faqA: { ...type.body, color: colors.textSecondary, marginTop: 10 },
});
