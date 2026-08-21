import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, shadow } from '@/theme';
import { useStore } from '@/store/useStore';
import type { MembershipPlan } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BottomSheet from '@/components/ui/BottomSheet';
import { inr } from '@/components/admin/analyticsData';

export default function MembershipPlans() {
  const plans = useStore((s) => s.membershipPlans);
  const updateMembershipPlan = useStore((s) => s.updateMembershipPlan);
  const [editing, setEditing] = useState<MembershipPlan | null>(null);
  const [draft, setDraft] = useState<{ price: string; duration: string; benefits: string }>({ price: '', duration: '', benefits: '' });

  const openEdit = (p: MembershipPlan) => {
    setEditing(p);
    setDraft({ price: String(p.price), duration: p.duration, benefits: p.benefits.join('\n') });
  };

  const save = () => {
    if (!editing) return;
    updateMembershipPlan(editing.id, {
      price: Number(draft.price) || editing.price,
      duration: draft.duration,
      benefits: draft.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
    });
    setEditing(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Membership Plan Management" description="Configure Silver / Gold / Premium / Diamond tiers for tailors & customers" />

      <View style={styles.grid}>
        {plans.map((p) => (
          <Card key={p.id} style={[styles.planCard, { borderColor: p.color, borderWidth: 1.5 }]}>
            <View style={[styles.badge, { backgroundColor: p.color + '22' }]}>
              <Ionicons name="diamond-outline" size={16} color={p.color} />
              <Text style={[styles.badgeText, { color: p.color }]}>{p.name}</Text>
            </View>
            <Text style={styles.audience}>{p.audience}</Text>
            <Text style={styles.price}>{inr(p.price)} <Text style={styles.duration}>/ {p.duration}</Text></Text>
            <View style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
              {p.benefits.map((b) => (
                <View key={b} style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={14} color={p.color} />
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}
            </View>
            <Button label="Edit Plan" variant="outline" onPress={() => openEdit(p)} />
          </Card>
        ))}
      </View>

      <BottomSheet visible={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name} (${editing.audience})` : ''}>
        <Input label="Price (₹)" keyboardType="numeric" value={draft.price} onChangeText={(v) => setDraft((d) => ({ ...d, price: v }))} />
        <Input label="Duration" value={draft.duration} onChangeText={(v) => setDraft((d) => ({ ...d, duration: v }))} />
        <Text style={styles.label}>Benefits (one per line)</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={draft.benefits}
          onChangeText={(v) => setDraft((d) => ({ ...d, benefits: v }))}
        />
        <Button label="Save Changes" onPress={save} style={{ marginTop: spacing.md }} />
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  planCard: { width: 260, ...shadow.card },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, marginBottom: 8 },
  badgeText: { fontFamily: font.bold, fontSize: 13 },
  audience: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary },
  price: { fontFamily: font.bold, fontSize: 24, color: colors.navy, marginTop: 6 },
  duration: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  benefitText: { fontFamily: font.regular, fontSize: 12, color: colors.text, flex: 1 },
  label: { ...{ fontFamily: font.medium, fontSize: 13 }, color: colors.text, marginBottom: 6 },
  textarea: { minHeight: 90, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, fontFamily: font.regular, fontSize: 13, color: colors.text, textAlignVertical: 'top', marginBottom: spacing.md },
});
