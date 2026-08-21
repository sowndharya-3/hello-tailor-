import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { readymade } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import ProductCard from '../../../components/ProductCard';
import { useApp } from '../../../store/AppState';

const CATS = ['All', 'Men', 'Women', 'Kids'];

export default function ReadymadeStore() {
  const { cart } = useApp();
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? readymade : readymade.filter((m) => m.category === cat);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Readymade Dress Store"
        subtitle="Ready to wear, no stitching wait"
        right={
          <Pressable onPress={() => router.push('/store/material/cart')} style={{ position: 'relative' }}>
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
          <ProductCard name={item.name} price={item.price} image={item.image} onPress={() => router.push(`/store/readymade/${item.id}`)} />
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
});
