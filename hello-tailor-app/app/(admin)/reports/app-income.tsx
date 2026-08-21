import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import { incomeBreakdown, inr } from '@/components/admin/analyticsData';

export default function AppIncomeReport() {
  const total = incomeBreakdown.reduce((s, i) => s + i.value, 0);
  const max = Math.max(...incomeBreakdown.map((i) => i.value));

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader title="App Income Report" subtitle="Platform income by source" />

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.totalLabel}>Total Platform Income</Text>
        <Text style={styles.totalValue}>{inr(total)}</Text>
      </Card>

      <Card>
        {incomeBreakdown.map((i) => (
          <View key={i.name} style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.rowHead}>
                <Text style={styles.name}>{i.name}</Text>
                <Text style={styles.value}>{inr(i.value)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(i.value / max) * 100}%` }]} />
              </View>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  totalLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  totalValue: { fontFamily: font.bold, fontSize: 28, color: colors.navy, marginTop: 4 },
  row: { marginBottom: spacing.md },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  value: { fontFamily: font.semibold, fontSize: 13, color: colors.navy },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.gold },
});
