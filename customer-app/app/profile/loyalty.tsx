import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '../../constants/theme';
import { loyaltyHistory } from '../../mocks/data';
import ScreenHeader from '../../components/ui/ScreenHeader';
import Button from '../../components/ui/Button';
import { useApp } from '../../store/AppState';

export default function Loyalty() {
  const { loyaltyPoints } = useApp();
  const earned = loyaltyHistory.filter((h) => h.type === 'earned').reduce((s, h) => s + h.points, 0);
  const redeemed = Math.abs(loyaltyHistory.filter((h) => h.type === 'redeemed').reduce((s, h) => s + h.points, 0));

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Loyalty Points" />
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{loyaltyPoints}</Text>
          <Text style={styles.summaryLabel}>Available</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{earned}</Text>
          <Text style={styles.summaryLabel}>Earned</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{redeemed}</Text>
          <Text style={styles.summaryLabel}>Redeemed</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <Button label="Redeem Points" variant="gold" onPress={() => Alert.alert('Redeem Points', '100 points = ₹50 discount on your next order.')} />
      </View>
      <Text style={styles.sectionTitle}>History</Text>
      <FlatList
        data={loyaltyHistory}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24, gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Ionicons name={item.type === 'earned' ? 'trending-up-outline' : 'gift-outline'} size={20} color={item.type === 'earned' ? colors.success : colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>
            <Text style={[styles.rowPoints, { color: item.points > 0 ? colors.success : colors.error }]}>{item.points > 0 ? '+' : ''}{item.points}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.screenH, marginBottom: spacing.lg },
  summaryCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: 'center' },
  summaryValue: { ...type.cardTitle, fontSize: 18, color: colors.primary },
  summaryLabel: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { ...type.sectionHeading, color: colors.text, paddingHorizontal: spacing.screenH, marginVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  rowLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  rowDate: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  rowPoints: { ...type.body, fontFamily: 'Inter_700Bold' },
});
