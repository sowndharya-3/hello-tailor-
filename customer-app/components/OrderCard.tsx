import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Order, orderStages, tailors } from '../mocks/data';
import { colors, type, spacing } from '../constants/theme';
import Card from './ui/Card';
import Badge from './ui/Badge';

function toneFor(status: Order['status']): 'info' | 'success' | 'error' {
  return status === 'Active' ? 'info' : status === 'Completed' ? 'success' : 'error';
}

export default function OrderCard({ order }: { order: Order }) {
  const tailor = tailors.find((t) => t.id === order.tailorId);
  return (
    <Card onPress={() => router.push(`/order/${order.id}`)} style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Image source={{ uri: tailor?.image }} style={styles.img} />
        <View style={{ flex: 1 }}>
          <Text style={styles.id}>{order.id}</Text>
          <Text style={styles.sub} numberOfLines={1}>{order.category} • {tailor?.shopName}</Text>
          <Text style={styles.sub}>Placed {order.placedOn}</Text>
        </View>
        <Text style={styles.amount}>₹{order.amount}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <Badge
          label={order.status === 'Active' ? orderStages[order.currentStageIndex] : order.status}
          tone={toneFor(order.status)}
        />
        <Text style={styles.viewLink}>View Details ›</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  img: { width: 56, height: 56, borderRadius: 10 },
  id: { ...type.cardTitle, fontSize: 14, color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  amount: { ...type.cardTitle, fontSize: 15, color: colors.primary },
  viewLink: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
