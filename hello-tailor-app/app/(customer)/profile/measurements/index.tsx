import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import EmptyState from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';

export default function Measurements() {
  const measurements = useStore((s) => s.measurements);
  const family = useStore((s) => s.family);
  const personName = (id: string) => (id === 'self' ? 'Myself' : family.find((f) => f.id === id)?.name ?? id);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Measurements"
        right={
          <Pressable onPress={() => router.push('/profile/measurements/add')}>
            <Ionicons name="add-circle-outline" size={26} color={colors.secondary} />
          </Pressable>
        }
      />
      <FlatList
        data={measurements}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.sub}>{personName(item.personId)} • {item.category}</Text>
            <View style={styles.fieldsWrap}>
              {Object.entries(item.fields).map(([k, v]) => (
                <View key={k} style={styles.fieldChip}>
                  <Text style={styles.fieldText}>{k}: {v}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="body-outline" title="No Measurements Saved" message="Save your measurements once and reuse them for every booking." ctaLabel="Add Measurement" onPress={() => router.push('/profile/measurements/add')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  label: { ...type.cardTitle, fontSize: 15, color: colors.text },
  date: { ...type.supporting, color: colors.disabledText },
  sub: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  fieldsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  fieldChip: { backgroundColor: colors.infoBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  fieldText: { ...type.supporting, fontSize: 11, color: colors.secondary },
});
