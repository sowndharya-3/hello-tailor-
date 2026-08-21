import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StepProgress } from '@/components/ui/Misc';
import Avatar from '@/components/ui/Avatar';
import { useStore, ME_CUSTOMER } from '@/store/useStore';

export default function SelectPerson() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const family = useStore((s) => s.family);

  const choose = (personId: string) => {
    updateBooking({ personId });
    router.push(`/booking/${tailorId}/cloth-details` as any);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Whose Measurement?" subtitle={`${booking.category} • Select a person`} />
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <StepProgress step={2} total={11} label="Person" />
      </View>
      <View style={{ padding: spacing.screenH, gap: 10 }}>
        <Pressable style={styles.row} onPress={() => choose('self')}>
          <Avatar uri={ME_CUSTOMER.avatar} name={ME_CUSTOMER.name} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Myself</Text>
            <Text style={styles.sub}>{ME_CUSTOMER.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
        </Pressable>
        {family.map((f) => (
          <Pressable key={f.id} style={styles.row} onPress={() => choose(f.id)}>
            <Avatar uri={f.avatar} name={f.name} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{f.name}</Text>
              <Text style={styles.sub}>{f.relationship}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.disabledText} />
          </Pressable>
        ))}
        <Pressable style={styles.addRow} onPress={() => router.push('/profile/family/add' as any)}>
          <Ionicons name="add-circle-outline" size={20} color={colors.secondary} />
          <Text style={styles.addText}>Add New Family Member</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  name: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  sub: { ...type.supporting, color: colors.textSecondary },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 14 },
  addText: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
