import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { materials } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import ProductCard from '../../../components/ProductCard';
import { useApp } from '../../../store/AppState';

const CATS = ['All', 'Cotton', 'Linen', 'Silk', 'Georgette', 'Wool'];

export default function MaterialStore() {
  const { cart } = useApp();
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? materials : materials.filter((m) => m.category === cat);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Material Store"
        subtitle="Fabrics by the meter"
        right={
          <Pressable onPress={() => router.push('/store/material/cart')} style={{ position: 'relative' }}>
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
          <ProductCard name={item.name} price={item.price} unit={item.unit} image={item.image} onPress={() => router.push(`/store/material/${item.id}`)} />
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
});
