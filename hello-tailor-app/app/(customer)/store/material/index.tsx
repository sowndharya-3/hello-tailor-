// Ported from customer-app/app/store/material/index.tsx — future-concept material store.
// Materials come from the shared seed, cart badge from the shared store's cart array.
import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { materials } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useStore } from '@/store/useStore';

const CATS = ['All', 'Cotton', 'Linen', 'Silk', 'Georgette', 'Wool'];

function ProductCard({ name, price, unit, image, onPress }: { name: string; price: number; unit?: string; image: string; onPress: () => void }) {
  return (
    <Pressable style={styles.productCard} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.productImg} />
      <View style={{ padding: spacing.cardInner }}>
        <Text style={styles.productName} numberOfLines={2}>{name}</Text>
        <Text style={styles.productPrice}>₹{price}{unit ? <Text style={styles.productUnit}> {unit}</Text> : null}</Text>
      </View>
    </Pressable>
  );
}

export default function MaterialStore() {
  const cart = useStore((s) => s.cart);
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? materials : materials.filter((m) => m.category === cat);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Material Store"
        subtitle="Fabrics by the meter"
        right={
          <Pressable onPress={() => router.push('/(customer)/store/material/cart')} style={{ position: 'relative' }}>
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cart.length ? <View style={styles.cartDot} /> : null}
          </Pressable>
        }
      />
      <View style={styles.banner}>
        <Ionicons name="sparkles-outline" size={16} color={colors.gold} />
        <Text style={styles.bannerText}>New: Order fabric directly and have it delivered before your stitching appointment</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATS}
        keyExtractor={(c) => c}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, gap: 8, paddingVertical: spacing.md }}
        renderItem={({ item }) => (
          <Pressable style={[styles.chip, cat === item && styles.chipActive]} onPress={() => setCat(item)}>
            <Text style={[styles.chipText, cat === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        )}
      />
      <FlatList
        data={list}
        numColumns={2}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        columnWrapperStyle={{ gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard name={item.name} price={item.price} unit={item.unit} image={item.image} onPress={() => router.push(`/(customer)/store/material/${item.id}`)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  banner: { flexDirection: 'row', gap: 8, alignItems: 'center', marginHorizontal: spacing.screenH, backgroundColor: colors.goldLightBg, borderRadius: radius.input, padding: 10 },
  bannerText: { flex: 1, ...type.supporting, color: colors.gold },
  cartDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  productCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  productImg: { width: '100%', height: 120 },
  productName: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  productPrice: { ...type.cardTitle, fontSize: 15, color: colors.primary, marginTop: 4 },
  productUnit: { ...type.supporting, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
});
