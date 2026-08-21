import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { familyMembers } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import EmptyState from '../../../components/ui/EmptyState';
import { useApp } from '../../../store/AppState';

export default function MeasurementHistory() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { measurements, updateBooking } = useApp();

  const personName = (id: string) => (id === 'self' ? 'Myself' : familyMembers.find((f) => f.id === id)?.name ?? id);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Measurement History" />
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
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable style={styles.actionBtn} onPress={() => {}}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.actionBtnPrimary]}
                onPress={() => {
                  updateBooking({ measurementId: item.id, personId: item.personId, category: item.category });
                  router.back();
                }}
              >
                <Text style={[styles.actionText, { color: colors.white }]}>Use for this Booking</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="body-outline" title="No Measurements Saved" message="Add a measurement while booking to see it here." />}
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
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.button, borderWidth: 1, borderColor: colors.secondary },
  actionBtnPrimary: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  actionText: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
