import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius, sizes } from '../../constants/theme';
import { tailors, categories } from '../../mocks/data';
import ScreenHeader from '../../components/ui/ScreenHeader';
import TailorCard from '../../components/TailorCard';
import EmptyState from '../../components/ui/EmptyState';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';

const RECENT = ['Blouse tailor near me', 'Suit stitching', 'Alteration'];
const POPULAR = ['Kurti stitching', 'Shirt tailor', 'Wedding blouse', 'Pant alteration'];
const SORTS = ['Relevance', 'Rating', 'Distance', 'Price: Low to High'];

export default function Search() {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('Relevance');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [availableOnly, setAvailableOnly] = useState(false);

  const results = useMemo(() => {
    let list = tailors.filter((t) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q || t.name.toLowerCase().includes(q) || t.shopName.toLowerCase().includes(q) || t.categories.some((c) => c.toLowerCase().includes(q));
      return matchesQuery && t.rating >= minRating && t.startingPrice <= maxPrice && (!availableOnly || t.isOpen);
    });
    if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'Distance') list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
    return list;
  }, [query, sort, minRating, maxPrice, availableOnly]);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Search" />
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search tailors, categories..."
            placeholderTextColor={colors.disabledText}
            style={styles.input}
            autoFocus
          />
        </View>
        <Pressable style={styles.iconBtn} onPress={() => setFiltersOpen(true)}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => setSortOpen(true)}>
          <Ionicons name="swap-vertical-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      {!query ? (
        <View style={{ paddingHorizontal: spacing.screenH }}>
          <Text style={styles.groupLabel}>Recent Searches</Text>
          <View style={styles.chipsWrap}>
            {RECENT.map((r) => (
              <Pressable key={r} style={styles.chip} onPress={() => setQuery(r)}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.chipText}>{r}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.groupLabel}>Popular Searches</Text>
          <View style={styles.chipsWrap}>
            {POPULAR.map((r) => (
              <Pressable key={r} style={styles.chip} onPress={() => setQuery(r)}>
                <Ionicons name="trending-up-outline" size={13} color={colors.secondary} />
                <Text style={styles.chipText}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: spacing.screenH }}
          renderItem={({ item }) => <TailorCard tailor={item} wide />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={<EmptyState icon="search-outline" title="No Tailors Found" message="Try a different keyword or adjust your filters." />}
        />
      )}

      <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <Text style={styles.filterLabel}>Category</Text>
        <View style={styles.chipsWrap}>
          {categories.slice(0, 6).map((c) => (
            <View key={c.id} style={styles.chip}>
              <Text style={styles.chipText}>{c.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.filterLabel}>Minimum Rating: {minRating || 'Any'}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[0, 3, 4, 4.5].map((r) => (
            <Pressable key={r} style={[styles.pill, minRating === r && styles.pillActive]} onPress={() => setMinRating(r)}>
              <Text style={[styles.pillText, minRating === r && styles.pillTextActive]}>{r === 0 ? 'Any' : `${r}+`}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.filterLabel}>Max Price: ₹{maxPrice}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[500, 1000, 2000, 5000].map((p) => (
            <Pressable key={p} style={[styles.pill, maxPrice === p && styles.pillActive]} onPress={() => setMaxPrice(p)}>
              <Text style={[styles.pillText, maxPrice === p && styles.pillTextActive]}>₹{p}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.toggleRow} onPress={() => setAvailableOnly((v) => !v)}>
          <Text style={styles.filterLabel}>Available Now Only</Text>
          <Ionicons name={availableOnly ? 'checkbox' : 'square-outline'} size={22} color={colors.secondary} />
        </Pressable>
        <Button label="Apply Filters" onPress={() => setFiltersOpen(false)} style={{ marginTop: spacing.lg }} />
      </BottomSheet>

      <BottomSheet visible={sortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        {SORTS.map((s) => (
          <Pressable key={s} style={styles.sortRow} onPress={() => { setSort(s); setSortOpen(false); }}>
            <Text style={styles.sortText}>{s}</Text>
            {sort === s ? <Ionicons name="checkmark-circle" size={20} color={colors.secondary} /> : null}
          </Pressable>
        ))}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.screenH, marginBottom: spacing.md },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: sizes.inputHeight, borderRadius: radius.search, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 },
  input: { flex: 1, ...type.body, color: colors.text },
  iconBtn: { width: sizes.inputHeight, height: sizes.inputHeight, borderRadius: radius.search, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary, marginTop: spacing.lg, marginBottom: 10 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipText: { ...type.supporting, color: colors.text },
  filterLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginTop: spacing.md, marginBottom: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  pillActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  pillText: { ...type.supporting, color: colors.text },
  pillTextActive: { color: colors.white },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  sortText: { ...type.body, color: colors.text },
});
