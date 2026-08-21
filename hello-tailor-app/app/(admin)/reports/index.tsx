import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';

const REPORT_LINKS: { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; href: string }[] = [
  { title: 'Sales Report', description: 'Daily, monthly and yearly sales performance with booking count and AOV.', icon: 'trending-up-outline', href: '/(admin)/reports/sales' },
  { title: 'Tailor Income Reports', description: 'Gross earnings, commission and net earnings broken down by tailor.', icon: 'pie-chart-outline', href: '/(admin)/reports/tailor-income' },
  { title: 'App Income Reports', description: 'Platform income by source: commissions, memberships, ads and more.', icon: 'pie-chart-outline', href: '/(admin)/reports/app-income' },
  { title: 'Analytics', description: 'Registrations, retention, conversion and marketplace health metrics.', icon: 'pulse-outline', href: '/(admin)/analytics' },
];

export default function ReportsHub() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Reports Dashboard" description="Central hub for all Hello Tailor performance reports" />
      <View style={styles.grid}>
        {REPORT_LINKS.map((r) => (
          <Pressable key={r.href} onPress={() => router.push(r.href as any)} style={styles.linkCard}>
            <Card>
              <View style={styles.row}>
                <View style={styles.iconWrap}><Ionicons name={r.icon} size={20} color={colors.ocean} /></View>
                <Ionicons name="arrow-forward" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.title}>{r.title}</Text>
              <Text style={styles.desc}>{r.description}</Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  linkCard: { width: 300 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: radius.card, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginTop: spacing.md },
  desc: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
