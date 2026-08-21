import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { tailors, reviews as seedReviews } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import StarRating from '../../../components/ui/StarRating';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import BottomSheet from '../../../components/ui/BottomSheet';
import EmptyState from '../../../components/ui/EmptyState';

export default function TailorReviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tailor = tailors.find((t) => t.id === id) ?? tailors[0];
  const [reviews, setReviews] = useState(seedReviews.filter((r) => r.tailorId === tailor.id));
  const [writeOpen, setWriteOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const total = reviews.length || 1;

  const submitReview = () => {
    setReviews((prev) => [
      { id: `local-${Date.now()}`, tailorId: tailor.id, name: 'Sowndharya Rajan', avatar: 'https://picsum.photos/seed/me/100/100', rating: newRating, date: 'Just now', text: newText || 'Great experience!', verified: true },
      ...prev,
    ]);
    setWriteOpen(false);
    setNewText('');
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Ratings & Reviews" subtitle={tailor.shopName} />
      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg }}>
            <View style={styles.summaryCard}>
              <View style={{ alignItems: 'center', width: 90 }}>
                <Text style={styles.bigRating}>{tailor.rating.toFixed(1)}</Text>
                <StarRating rating={tailor.rating} showValue={false} />
                <Text style={styles.reviewCount}>{tailor.reviewCount} reviews</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                {breakdown.map((b) => (
                  <View key={b.star} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.barLabel}>{b.star}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${(b.count / total) * 100}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <Button label="Write a Review" variant="outline" style={{ marginTop: spacing.lg }} onPress={() => setWriteOpen(true)} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.verified ? <Badge label="Verified Order" tone="success" /> : null}
                </View>
                <StarRating rating={item.rating} showValue={false} size={12} />
              </View>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="chatbox-ellipses-outline" title="No Reviews Yet" message="Be the first to review this tailor after your order." />}
      />

      <BottomSheet visible={writeOpen} onClose={() => setWriteOpen(false)} title="Write a Review">
        <Text style={styles.label}>Your Rating</Text>
        <StarRating rating={newRating} showValue={false} size={30} editable onChange={setNewRating} />
        <Text style={[styles.label, { marginTop: spacing.lg }]}>Your Review</Text>
        <TextInput
          value={newText}
          onChangeText={setNewText}
          placeholder="Share your experience..."
          placeholderTextColor={colors.disabledText}
          multiline
          style={styles.textArea}
        />
        <Button label="Submit Review" onPress={submitReview} style={{ marginTop: spacing.lg }} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  summaryCard: { flexDirection: 'row', gap: spacing.lg, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  bigRating: { ...type.price, color: colors.text },
  reviewCount: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  barLabel: { ...type.supporting, color: colors.textSecondary, width: 10 },
  barTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.disabledBg, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.gold },
  reviewCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  name: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  date: { ...type.supporting, color: colors.disabledText },
  text: { ...type.body, color: colors.textSecondary, marginTop: 8 },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8 },
  textArea: { minHeight: 100, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, textAlignVertical: 'top', ...type.body, color: colors.text },
});
