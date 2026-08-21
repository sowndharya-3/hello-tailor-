import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { colors, type, spacing, radius } from '../../constants/theme';
import { offers } from '../../mocks/data';
import ScreenHeader from '../../components/ui/ScreenHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function Offers() {
  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Offers & Coupons" />
      <FlatList
        data={offers}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Badge label={item.discount} tone="gold" />
              <Text style={styles.validity}>Valid till {item.validity}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.codeRow}>
              <Text style={styles.code}>{item.code}</Text>
              <Button label="Apply" style={{ minHeight: 36, paddingHorizontal: 16 }} onPress={() => Alert.alert('Coupon Applied', `${item.code} will be applied at checkout.`)} />
            </View>
            <Text style={styles.terms}>Min order ₹{item.minOrder} • {item.terms}</Text>
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
