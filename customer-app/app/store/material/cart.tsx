import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import StepFooter from '../../../components/StepFooter';
import EmptyState from '../../../components/ui/EmptyState';
import { useApp } from '../../../store/AppState';

export default function Cart() {
  const { cart, removeFromCart } = useApp();
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (placed) {
    return (
      <View style={styles.successWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        <Text style={styles.successTitle}>Order Placed</Text>
        <Text style={styles.successSub}>Your fabric order will be delivered in 3-5 business days.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Cart" subtitle={`${cart.length} item(s)`} />
      <FlatList
        data={cart}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.sub}>{item.qty} × ₹{item.price}</Text>
            </View>
            <Text style={styles.lineTotal}>₹{item.qty * item.price}</Text>
            <Pressable onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="cart-outline" title="Your Cart is Empty" message="Browse the material store to add fabrics to your cart." ctaLabel="Browse Materials" onPress={() => router.back()} />}
      />
      {cart.length ? (
        <StepFooter label={`Checkout • ₹${total}`} onPress={() => setPlaced(true)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  img: { width: 52, height: 52, borderRadius: 10 },
  name: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  lineTotal: { ...type.body, fontFamily: 'Inter_700Bold', color: colors.primary },
  successWrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.section },
  successTitle: { ...type.sectionHeading, color: colors.text, marginTop: spacing.lg },
  successSub: { ...type.body, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
});
