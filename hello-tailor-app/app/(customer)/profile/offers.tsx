import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import type { Coupon } from '@/store/types';

function discountLabel(c: Coupon) {
  return c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;
}

// ponytail: Coupon has no separate `terms` field like the old mock — synthesize one from
// eligibility/maxDiscount instead of adding a field the store doesn't have.
function termsLabel(c: Coupon) {
  const bits = [`Eligible: ${c.eligibility}`];
  if (c.maxDiscount) bits.push(`Max discount ₹${c.maxDiscount}`);
  return bits.join(' • ');
}

export default function Offers() {
  const coupons = useStore((s) => s.coupons).filter((c) => c.status === 'Active');

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Offers & Coupons" />
      <FlatList
        data={coupons}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge label={discountLabel(item)} tone="gold" />
              <Text style={styles.validity}>Valid till {item.validTo}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.codeRow}>
              <Text style={styles.code}>{item.code}</Text>
              <Button label="Apply" style={{ minHeight: 36, paddingHorizontal: 16 }} onPress={() => Alert.alert('Coupon Applied', `${item.code} will be applied at checkout.`)} />
            </View>
            <Text style={styles.terms}>Min order ₹{item.minBooking} • {termsLabel(item)}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="pricetag-outline" title="No Offers Available" message="Check back soon for new discounts and coupons." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.goldLightBg, borderRadius: radius.card, borderWidth: 1, borderColor: colors.gold, padding: spacing.cardInner },
  title: { ...type.cardTitle, fontSize: 16, color: colors.text, marginTop: 8 },
  validity: { ...type.supporting, color: colors.textSecondary },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.input, padding: 10 },
  code: { ...type.body, fontFamily: 'Inter_700Bold', color: colors.primary, letterSpacing: 1 },
  terms: { ...type.supporting, color: colors.textSecondary, marginTop: 8 },
});
