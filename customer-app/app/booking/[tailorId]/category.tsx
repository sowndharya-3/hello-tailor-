import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { tailors, categories } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import BookingProgress from '../../../components/BookingProgress';
import { useApp } from '../../../store/AppState';

export default function SelectCategory() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const { updateBooking, resetBooking } = useApp();

  React.useEffect(() => {
    resetBooking();
    updateBooking({ tailorId: tailor.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Select Category" subtitle={tailor.shopName} />
      <BookingProgress step="category" />
      <View style={styles.tailorRow}>
        <Image source={{ uri: tailor.image }} style={styles.tailorImg} />
        <View>
          <Text style={styles.tailorName}>{tailor.shopName}</Text>
          <Text style={styles.tailorSub}>Who's stitching: {tailor.name}</Text>
        </View>
      </View>
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: 14 }}
        columnWrapperStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.catCard}
            onPress={() => {
              updateBooking({ category: item.name });
              router.push(`/booking/${tailor.id}/person`);
            }}
          >
            <Ionicons name={item.icon as any} size={26} color={colors.secondary} />
            <Text style={styles.catLabel}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  tailorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.screenH, marginBottom: 4 },
  tailorImg: { width: 40, height: 40, borderRadius: 10 },
  tailorName: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.text },
  tailorSub: { ...type.supporting, color: colors.textSecondary },
  catCard: { flex: 1, aspectRatio: 1, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 8 },
  catLabel: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
});
