import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { orders, tailors } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Button from '../../../components/ui/Button';
import { useApp } from '../../../store/AppState';

export default function Reorder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const tailor = tailors.find((t) => t.id === order.tailorId);
  const { resetBooking, updateBooking } = useApp();
  const [confirming, setConfirming] = useState(false);

  const proceed = () => {
    resetBooking();
    updateBooking({ tailorId: tailor?.id, category: order.category, personId: 'self' });
    router.replace(`/booking/${tailor?.id}/cloth-details`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Re-order" subtitle={order.id} />
      <View style={{ padding: spacing.screenH }}>
        <View style={styles.card}>
          <Image source={{ uri: tailor?.image }} style={styles.img} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{tailor?.shopName}</Text>
            <Text style={styles.sub}>{order.category} • Same measurement & design will be prefilled</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
          <Text style={styles.infoText}>We'll prefill the tailor, category, saved measurement and design references from this order. You can review and edit everything before confirming.</Text>
        </View>

        {!confirming ? (
          <Button label="Re-order with Same Details" onPress={() => setConfirming(true)} style={{ marginTop: spacing.lg }} />
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirm Re-order?</Text>
            <Text style={styles.confirmSub}>You'll be taken through the booking flow with your previous choices prefilled.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setConfirming(false)} />
              <Button label="Confirm" style={{ flex: 1 }} onPress={proceed} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  img: { width: 52, height: 52, borderRadius: 12 },
  name: { ...type.cardTitle, fontSize: 15, color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  infoBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.infoBg, borderRadius: radius.input, padding: 12, marginTop: spacing.lg },
  infoText: { flex: 1, ...type.supporting, color: colors.secondary },
  confirmBox: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginTop: spacing.lg },
  confirmTitle: { ...type.cardTitle, color: colors.text },
  confirmSub: { ...type.body, color: colors.textSecondary, marginTop: 4 },
});
