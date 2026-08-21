import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { complaints } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';

export default function Complaints() {
  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="My Complaints"
        right={
          <Pressable onPress={() => router.push('/profile/complaints/new')}>
            <Ionicons name="add-circle-outline" size={26} color={colors.secondary} />
          </Pressable>
        }
      />
      <FlatList
        data={complaints}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/profile/complaints/${item.id}`)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.category}>{item.category}</Text>
              <Badge label={item.status} tone={item.status === 'Resolved' ? 'success' : 'warning'} />
            </View>
            <Text style={styles.order}>Order: {item.orderId}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.date}>Raised on {item.date}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState icon="alert-circle-outline" title="No Complaints Raised" message="If something went wrong with an order, you can raise a ticket anytime." ctaLabel="Raise a Ticket" onPress={() => router.push('/profile/complaints/new')} />}
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
