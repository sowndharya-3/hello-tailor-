import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { orders, orderStages, tailors } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

function timestampFor(index: number, currentIndex: number) {
  if (index > currentIndex) return null;
  const base = new Date(2026, 7, 12, 10, 0);
  base.setHours(base.getHours() + index * 7);
  return base.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const tailor = tailors.find((t) => t.id === order.tailorId);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Track Order" subtitle={order.id} />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.tailorRow}>
          <Image source={{ uri: tailor?.image }} style={styles.tailorImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tailorName}>{tailor?.shopName}</Text>
            <Text style={styles.tailorSub}>{order.category}</Text>
          </View>
          {order.status === 'Active' ? <Badge label={orderStages[order.currentStageIndex]} tone="info" /> : <Badge label={order.status} tone={order.status === 'Completed' ? 'success' : 'error'} />}
        </View>

        <View style={styles.timeline}>
          {orderStages.map((stage, i) => {
            const done = i <= order.currentStageIndex;
            const isLast = i === orderStages.length - 1;
            const ts = timestampFor(i, order.currentStageIndex);
            return (
              <View key={stage} style={styles.stageRow}>
                <View style={styles.stageLeft}>
                  <View style={[styles.stageDot, done && styles.stageDotDone]}>
                    {done ? <Ionicons name="checkmark" size={12} color={colors.white} /> : null}
                  </View>
                  {!isLast ? <View style={[styles.stageLine, done && styles.stageLineDone]} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : 18 }}>
                  <Text style={[styles.stageLabel, done && styles.stageLabelDone]}>{stage}</Text>
                  {ts ? <Text style={styles.stageTime}>{ts}</Text> : <Text style={styles.stagePending}>Pending</Text>}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
          {order.balanceDue > 0 ? (
            <Button label={`Pay Balance ₹${order.balanceDue}`} style={{ flex: 1 }} onPress={() => router.push(`/order/${order.id}/balance-payment`)} />
          ) : (
            <Button label="View Invoice" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/order/${order.id}/invoice`)} />
          )}
          <Button label="Re-order" variant="outline" style={{ flex: 1 }} onPress={() => router.push(`/order/${order.id}/reorder`)} />
        </View>
        <Pressable style={styles.complaintLink} onPress={() => router.push({ pathname: '/profile/complaints/new', params: { orderId: order.id } })}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
          <Text style={styles.complaintText}>Report an issue with this order</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  tailorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.section },
  tailorImg: { width: 48, height: 48, borderRadius: 10 },
  tailorName: { ...type.cardTitle, fontSize: 15, color: colors.text },
  tailorSub: { ...type.supporting, color: colors.textSecondary },
  timeline: { paddingLeft: 4 },
  stageRow: { flexDirection: 'row' },
  stageLeft: { alignItems: 'center', width: 28 },
  stageDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center' },
  stageDotDone: { backgroundColor: colors.success },
  stageLine: { width: 2, flex: 1, backgroundColor: colors.disabledBg, marginTop: 2 },
  stageLineDone: { backgroundColor: colors.success },
  stageLabel: { ...type.body, color: colors.textSecondary, marginLeft: 10 },
  stageLabelDone: { fontFamily: 'Inter_600SemiBold', color: colors.text },
  stageTime: { ...type.supporting, color: colors.textSecondary, marginLeft: 10, marginTop: 2 },
  stagePending: { ...type.supporting, color: colors.disabledText, marginLeft: 10, marginTop: 2 },
  complaintLink: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  complaintText: { ...type.supporting, color: colors.error, fontFamily: 'Inter_500Medium' },
});
