import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildDays() {
  const days = [];
  const today = new Date(2026, 7, 21); // fixed "today" for stable mock demo (21 Aug 2026)
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      key: d.toISOString().slice(0, 10),
      unavailable: d.getDay() === 0 || i % 9 === 0, // ponytail: mock unavailability pattern, not real tailor calendar
    });
  }
  return days;
}

export default function BookingDate() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { updateBooking } = useApp();
  const days = buildDays();
  const [selected, setSelected] = useState<string | null>(null);

  const submit = () => {
    const d = days.find((x) => x.key === selected)!;
    updateBooking({ bookingDate: d.date.toDateString() });
    router.push(`/booking/${tailorId}/delivery`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Booking Date" subtitle="When should the tailor start?" />
      <BookingProgress step="date" />
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]} /><Text style={styles.legendText}>Available</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: colors.disabledBg }]} /><Text style={styles.legendText}>Unavailable</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: colors.secondary }]} /><Text style={styles.legendText}>Selected</Text></View>
      </View>
      <FlatList
        data={days}
        numColumns={4}
        keyExtractor={(d) => d.key}
        contentContainerStyle={{ padding: spacing.screenH, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const isSelected = selected === item.key;
          return (
            <Pressable
              disabled={item.unavailable}
              style={[styles.dayCell, item.unavailable && styles.dayDisabled, isSelected && styles.daySelected]}
              onPress={() => setSelected(item.key)}
            >
              <Text style={[styles.dayName, isSelected && { color: colors.white }, item.unavailable && { color: colors.disabledText }]}>
                {DAY_NAMES[item.date.getDay()]}
              </Text>
              <Text style={[styles.dayNum, isSelected && { color: colors.white }, item.unavailable && { color: colors.disabledText }]}>
                {item.date.getDate()}
              </Text>
            </Pressable>
          );
        }}
      />
      <StepFooter label="Continue" onPress={submit} disabled={!selected} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  legend: { flexDirection: 'row', gap: 16, paddingHorizontal: spacing.screenH, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...type.supporting, color: colors.textSecondary },
  dayCell: { flex: 1, aspectRatio: 1, borderRadius: radius.input, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dayDisabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  daySelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  dayName: { ...type.supporting, fontSize: 10, color: colors.textSecondary },
  dayNum: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.text },
});
