import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing } from '@/theme';
import { categories } from '@/data/seed';
import { useStore } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import TailorCard from '../_components/TailorCard';

export default function CategoryBrowse() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tailors = useStore((s) => s.tailors);
  const initial = categories.find((c) => c.id === id)?.name ?? null;
  const [active, setActive] = useState<string | null>(initial);

  const list = active ? tailors.filter((t) => t.categories.includes(active)) : tailors;

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Browse Categories" />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, gap: 14, paddingBottom: spacing.lg }}
        renderItem={({ item }) => {
          const isActive = active === item.name;
          return (
            <Pressable style={styles.catItem} onPress={() => setActive(isActive ? null : item.name)}>
              <View style={[styles.catCircle, isActive && styles.catCircleActive]}>
                <Ionicons name={item.icon as any} size={22} color={isActive ? colors.white : colors.secondary} />
              </View>
              <Text style={[styles.catLabel, isActive && { color: colors.secondary, fontFamily: 'Inter_600SemiBold' }]}>{item.name}</Text>
            </Pressable>
          );
        }}
      />
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => <TailorCard tailor={item} wide />}
        ListEmptyComponent={<EmptyState icon="grid-outline" title="No Tailors Found" message="No tailors currently offer this category nearby." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  catItem: { alignItems: 'center', gap: 6, width: 68 },
  catCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  catCircleActive: { backgroundColor: colors.secondary },
  catLabel: { ...type.supporting, color: colors.text, textAlign: 'center' },
});
