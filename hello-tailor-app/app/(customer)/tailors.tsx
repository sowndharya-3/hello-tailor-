import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { categories } from '@/data/seed';
import { useStore } from '@/store/useStore';
import TailorCard from './_components/TailorCard';

export default function TailorsTab() {
  const tailors = useStore((s) => s.tailors);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const list = activeCat ? tailors.filter((t) => t.categories.includes(activeCat)) : tailors;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>All Tailors</Text>
        <Pressable style={styles.searchBtn} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={20} color={colors.text} />
        </Pressable>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, gap: 8, paddingBottom: 12 }}
        renderItem={({ item }) => {
          const active = activeCat === item.name;
          return (
            <Pressable
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCat(active ? null : item.name)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
            </Pressable>
          );
        }}
      />
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => <TailorCard tailor={item} wide />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.screenH, paddingTop: 12, paddingBottom: 12 },
  title: { ...type.pageTitle, color: colors.text },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
  chipTextActive: { color: colors.white },
});
