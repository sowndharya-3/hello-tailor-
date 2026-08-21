import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable, FlatList, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius, shadow } from '@/theme';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const { width } = Dimensions.get('window');

export default function TailorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tailors = useStore((s) => s.tailors);
  const reviews = useStore((s) => s.reviews);
  const tailor = tailors.find((t) => t.id === id) ?? tailors[0];
  const tailorReviews = reviews.filter((r) => r.tailorId === tailor.id && r.status === 'Visible');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <View style={styles.wrap}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View>
          <Image source={{ uri: tailor.cover }} style={styles.cover} />
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Image source={{ uri: tailor.image }} style={styles.shopImg} />
        </View>

        <View style={styles.headerBlock}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.shopName}>{tailor.shopName}</Text>
            {tailor.verified ? <Ionicons name="checkmark-circle" size={18} color={colors.secondary} /> : null}
          </View>
          <Text style={styles.tailorName}>{tailor.name} • {tailor.experienceYears} yrs experience</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <StarRating rating={tailor.rating} reviewCount={tailor.reviewCount} />
            <Badge label={tailor.isOpen ? 'Open Now' : 'Closed'} tone={tailor.isOpen ? 'success' : 'error'} />
            {tailor.featured ? <Badge label="Featured" tone="gold" /> : null}
            <Badge label={tailor.type} tone="navy" withIcon={false} />
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={colors.secondary} />
              <Text style={styles.infoText}>{tailor.distanceKm} km • {tailor.locality}, {tailor.city}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={colors.secondary} />
              <Text style={styles.infoText}>{tailor.workingHours}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={16} color={colors.secondary} />
              <Text style={styles.infoText}>Delivery in {tailor.deliveryDays} days</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.about}>{tailor.about}</Text>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={28} color={colors.secondary} />
            <Text style={styles.mapText}>{tailor.locality}, {tailor.city} — Map preview</Text>
          </View>

          <Text style={styles.sectionTitle}>Stitching Categories & Prices</Text>
          {tailor.services.map((s) => (
            <View key={s.id} style={styles.serviceRow}>
              <Text style={styles.serviceName}>{s.name}</Text>
              <Text style={styles.servicePrice}>₹{s.price} <Text style={styles.serviceUnit}>{s.unit}</Text></Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Photo Gallery</Text>
          <FlatList
            data={tailor.gallery}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `g${i}`}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => setViewerIndex(index)}>
                <Image source={{ uri: item }} style={styles.galleryImg} />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.section }}>
            <Text style={styles.sectionTitle}>Reviews ({tailorReviews.length})</Text>
            <Pressable onPress={() => router.push(`/tailor/${tailor.id}/reviews`)}>
              <Text style={styles.seeAll}>See All ›</Text>
            </Pressable>
          </View>
          {tailorReviews.slice(0, 2).map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{r.customerName}</Text>
                  <StarRating rating={r.rating} showValue={false} size={12} />
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.stickyLabel}>Starting at</Text>
          <Text style={styles.stickyPrice}>₹{tailor.startingPrice}</Text>
        </View>
        <Button label="Book Now" style={{ flex: 1, marginLeft: 16 }} onPress={() => router.push(`/booking/${tailor.id}/category` as any)} />
      </View>

      <Modal visible={viewerIndex !== null} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <Pressable style={styles.viewerClose} onPress={() => setViewerIndex(null)}>
            <Ionicons name="close" size={28} color={colors.white} />
          </Pressable>
          {viewerIndex !== null ? (
            <Image source={{ uri: tailor.gallery[viewerIndex] }} style={styles.viewerImg} resizeMode="contain" />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  cover: { width: '100%', height: 190 },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  shopImg: { width: 84, height: 84, borderRadius: 16, borderWidth: 3, borderColor: colors.white, position: 'absolute', bottom: -32, left: spacing.screenH },
  headerBlock: { paddingHorizontal: spacing.screenH, paddingTop: 44 },
  shopName: { ...type.pageTitle, fontSize: 21, color: colors.text },
  tailorName: { ...type.body, color: colors.textSecondary, marginTop: 2 },
  infoGrid: { marginTop: spacing.lg, gap: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { ...type.body, color: colors.text },
  sectionTitle: { ...type.sectionHeading, color: colors.text, marginTop: spacing.section, marginBottom: 10 },
  about: { ...type.body, color: colors.textSecondary, lineHeight: 21 },
  mapPlaceholder: { height: 120, borderRadius: radius.card, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md, gap: 6 },
  mapText: { ...type.supporting, color: colors.secondary },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceName: { ...type.body, color: colors.text },
  servicePrice: { ...type.body, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  serviceUnit: { ...type.supporting, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  galleryImg: { width: 96, height: 96, borderRadius: radius.input },
  seeAll: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary, marginTop: spacing.section },
  reviewCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewName: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  reviewDate: { ...type.supporting, color: colors.disabledText },
  reviewText: { ...type.body, color: colors.textSecondary, marginTop: 8 },
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: spacing.screenH, paddingVertical: 14, paddingBottom: 24,
  },
  stickyLabel: { ...type.supporting, color: colors.textSecondary },
  stickyPrice: { ...type.price, fontSize: 22, color: colors.primary },
  viewerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  viewerClose: { position: 'absolute', top: 50, right: 20, zIndex: 1 },
  viewerImg: { width: width - 32, height: width - 32 },
});
