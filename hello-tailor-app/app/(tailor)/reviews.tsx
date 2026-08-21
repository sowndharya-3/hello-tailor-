// Ported from tailor-app/app/reviews.tsx — filtered to reviews.tailorId === myTailorId; the
// shared Review type has `text` (not `comment`) and no `category` field.
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '@/components/ui/ScreenHeader';
import StarRating from '@/components/ui/StarRating';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function Reviews() {
  const reviews = useStore((s) => s.reviews.filter((r) => r.tailorId === s.myTailorId));
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star, count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <View style={styles.container}>
      <ScreenHeader title="Customer Reviews" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {total === 0 ? (
          <EmptyState icon="star-outline" title="No Reviews" message="Once customers rate your work, reviews will appear here." />
        ) : (
          <>
            <Card style={styles.summaryCard}>
              <View style={{ alignItems: 'center', marginRight: spacing.xl }}>
                <Text style={styles.avgValue}>{avg.toFixed(1)}</Text>
                <StarRating rating={avg} size={16} />
                <Text style={styles.totalText}>{total} reviews</Text>
              </View>
              <View style={{ flex: 1 }}>
                {dist.map((d) => (
                  <View key={d.star} style={styles.barRow}>
                    <Text style={styles.barLabel}>{d.star}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${total ? (d.count / total) * 100 : 0}%` }]} />
                    </View>
                    <Text style={styles.barCount}>{d.count}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {reviews.map((r) => (
              <Card key={r.id} style={{ marginBottom: spacing.md }}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: r.avatar }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{r.customerName}</Text>
                    <Text style={styles.category}>{new Date(r.date).toLocaleDateString('en-IN')}</Text>
                  </View>
                </View>
                <StarRating rating={r.rating} size={14} />
                <Text style={styles.comment}>{r.text}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  summaryCard: { flexDirection: 'row', marginBottom: spacing.lg },
  avgValue: { fontFamily: font.bold, fontSize: 32, color: colors.textPrimary },
  totalText: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  barLabel: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, width: 10 },
  barTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.disabledBg, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.gold },
  barCount: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, width: 16, textAlign: 'right' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: spacing.md },
  name: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  category: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  comment: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm, lineHeight: 19 },
});
