// Ported from customer-app/app/store/readymade/index.tsx — readymade items from shared seed,
// cart badge from shared store (cart route reused from the material store, as in the old app).
import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { readymade } from '@/data/seed';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useStore } from '@/store/useStore';

const CATS = ['All', 'Men', 'Women', 'Kids'];

function ProductCard({ name, price, image, onPress }: { name: string; price: number; image: string; onPress: () => void }) {
  return (
    <Pressable style={styles.productCard} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.productImg} />
      <View style={{ padding: spacing.cardInner }}>
        <Text style={styles.productName} numberOfLines={2}>{name}</Text>
        <Text style={styles.productPrice}>₹{price}</Text>
      </View>
    </Pressable>
  );
}

export default function ReadymadeStore() {
  const cart = useStore((s) => s.cart);
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? readymade : readymade.filter((m) => m.category === cat);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Readymade Dress Store"
        subtitle="Ready to wear, no stitching wait"
        right={
          <Pressable onPress={() => router.push('/(customer)/store/material/cart')} style={{ position: 'relative' }}>
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cart.length ? <View style={styles.cartDot} /> : null}
          </Pressable>
        }
      />
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
            <ProductCard name={item.name} price={item.price} image={item.image} onPress={() => router.push(`/(customer)/store/readymade/${item.id}`)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  cartDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
  productCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  productImg: { width: '100%', height: 120 },
  productName: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  productPrice: { ...type.cardTitle, fontSize: 15, color: colors.primary, marginTop: 4 },
});
