// Ported from customer-app/app/profile/complaints/index.tsx — sourced from the shared store's
// complaints array (admin-facing, seeded), filtered to the demo customer instead of a local mock.
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useStore, ME_CUSTOMER } from '@/store/useStore';

export default function Complaints() {
  const complaints = useStore((s) => s.complaints).filter((c) => c.customerName === ME_CUSTOMER.name);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="My Complaints"
        right={
          <Pressable onPress={() => router.push('/(customer)/profile/complaints/new')}>
            <Ionicons name="add-circle-outline" size={26} color={colors.secondary} />
          </Pressable>
        }
      />
      <FlatList
        data={complaints}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(customer)/profile/complaints/${item.id}`)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.category}>{item.category}</Text>
              <Badge label={item.status} tone={item.status === 'Resolved' ? 'success' : 'warning'} />
            </View>
            <Text style={styles.order}>Order: {item.bookingId}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.date}>Raised on {new Date(item.submittedDate).toLocaleDateString('en-IN')}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState icon="alert-circle-outline" title="No Complaints Raised" message="If something went wrong with an order, you can raise a ticket anytime." ctaLabel="Raise a Ticket" onPress={() => router.push('/(customer)/profile/complaints/new')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  category: { ...type.cardTitle, fontSize: 15, color: colors.text },
  order: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  desc: { ...type.body, color: colors.textSecondary, marginTop: 6 },
  date: { ...type.supporting, color: colors.disabledText, marginTop: 8 },
});
