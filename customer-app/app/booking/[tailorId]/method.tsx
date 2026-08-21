import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import StepFooter from '../../../components/StepFooter';
import { useApp } from '../../../store/AppState';

const METHODS = [
  { id: 'Self Drop', icon: 'walk-outline', desc: 'Drop off the cloth at the tailor\'s shop yourself', fee: 0 },
  { id: 'Self Pickup', icon: 'bag-check-outline', desc: 'Pick up the finished order from the shop yourself', fee: 0 },
  { id: 'Tailor Pickup', icon: 'bicycle-outline', desc: 'Tailor picks up the cloth from your address', fee: 49 },
  { id: 'Home Delivery', icon: 'home-outline', desc: 'Finished order delivered to your address', fee: 59 },
] as const;

const SLOTS = ['9:00 AM – 12:00 PM', '12:00 PM – 3:00 PM', '3:00 PM – 6:00 PM', '6:00 PM – 9:00 PM'];

export default function Method() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const { booking, updateBooking, addresses } = useApp();
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('Self Drop');
  const [slot, setSlot] = useState(SLOTS[0]);
  const needsAddress = method === 'Tailor Pickup' || method === 'Home Delivery';
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const submit = () => {
    updateBooking({ method, timeSlot: slot, addressId: needsAddress ? defaultAddress?.id : undefined });
    router.push(`/booking/${tailorId}/notes`);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Pickup & Delivery" subtitle="How should we handle your cloth?" />
      <BookingProgress step="method" />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}>
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <Pressable key={m.id} style={[styles.card, active && styles.cardActive]} onPress={() => setMethod(m.id)}>
              <View style={styles.iconWrap}>
                <Ionicons name={m.icon as any} size={22} color={colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{m.id}</Text>
                <Text style={styles.cardDesc}>{m.desc}</Text>
                <Text style={styles.cardFee}>{m.fee ? `₹${m.fee} fee` : 'Free'}</Text>
              </View>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.secondary} />
            </Pressable>
          );
        })}

        {needsAddress ? (
          <View style={styles.addressCard}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.addressText}>{defaultAddress?.label} — {defaultAddress?.address}, {defaultAddress?.city}</Text>
          </View>
        ) : null}

        <Text style={[styles.label, { marginTop: spacing.sm }]}>Preferred Time Slot</Text>
        <View style={styles.chipsWrap}>
          {SLOTS.map((s) => (
            <Pressable key={s} style={[styles.chip, slot === s && styles.chipActive]} onPress={() => setSlot(s)}>
              <Text style={[styles.chipText, slot === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <StepFooter label="Continue" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.border, padding: spacing.cardInner },
  cardActive: { borderColor: colors.secondary, backgroundColor: colors.infoBg },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.text },
  cardDesc: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  cardFee: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.primary, marginTop: 4 },
  addressCard: { backgroundColor: colors.infoBg, borderRadius: radius.card, padding: spacing.cardInner },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  addressText: { ...type.body, color: colors.textSecondary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { ...type.supporting, color: colors.text },
  chipTextActive: { color: colors.white },
});
