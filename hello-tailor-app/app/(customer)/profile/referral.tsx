import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '@/theme';
import { referrals } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const CODE = 'SOWND2026';

export default function Referral() {
  const totalReward = referrals.reduce((s, r) => s + r.reward, 0);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Refer & Earn" />
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <View style={styles.hero}>
          <Ionicons name="gift" size={36} color={colors.gold} />
          <Text style={styles.heroTitle}>Give ₹100, Get ₹100</Text>
          <Text style={styles.heroSub}>Invite friends to Hello Tailor. They get ₹100 off their first order, you get ₹100 credited to your wallet.</Text>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{CODE}</Text>
            <Pressable onPress={() => Alert.alert('Copied', 'Referral code copied to clipboard.')}>
              <Ionicons name="copy-outline" size={18} color={colors.secondary} />
            </Pressable>
          </View>
          <Button label="Share Invite Link" onPress={() => Alert.alert('Share', 'Invite link shared (mock).')} style={{ marginTop: spacing.md, width: '100%' }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>{referrals.filter((r) => r.status === 'Joined').length}</Text><Text style={styles.statLabel}>Successful Referrals</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>₹{totalReward}</Text><Text style={styles.statLabel}>Rewards Earned</Text></View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Referral History</Text>
      <FlatList
        data={referrals}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24, gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{item.name}</Text>
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>
            <Badge label={item.status} tone={item.status === 'Joined' ? 'success' : 'warning'} />
            {item.reward ? <Text style={styles.reward}>+₹{item.reward}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', backgroundColor: colors.goldLightBg, borderRadius: radius.premium, padding: spacing.xl, gap: 6, borderWidth: 1, borderColor: colors.gold },
  heroTitle: { ...type.pageTitle, fontSize: 20, color: colors.text, marginTop: 4 },
  heroSub: { ...type.body, color: colors.textSecondary, textAlign: 'center' },
  codeBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border },
  code: { ...type.body, fontFamily: 'Inter_700Bold', color: colors.primary, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: 'center' },
  statValue: { ...type.cardTitle, fontSize: 18, color: colors.primary },
  statLabel: { ...type.supporting, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  sectionTitle: { ...type.sectionHeading, color: colors.text, paddingHorizontal: spacing.screenH, marginVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  rowLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  rowDate: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  reward: { ...type.body, fontFamily: 'Inter_700Bold', color: colors.success },
});
