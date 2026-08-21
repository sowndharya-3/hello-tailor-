import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Tailor } from '../mocks/data';
import { colors, radius, spacing, type } from '../constants/theme';
import Card from './ui/Card';
import Badge from './ui/Badge';
import StarRating from './ui/StarRating';
import Button from './ui/Button';

export default function TailorCard({ tailor, wide }: { tailor: Tailor; wide?: boolean }) {
  return (
    <Card noPadding style={{ width: wide ? '100%' : 240, marginRight: wide ? 0 : spacing.md, overflow: 'hidden' }}>
      <View>
        <Image source={{ uri: tailor.image }} style={styles.image} />
        {tailor.featured ? (
          <View style={styles.featuredTag}>
            <Badge label="Featured" tone="gold" />
          </View>
        ) : null}
        <View style={styles.statusTag}>
          <Badge label={tailor.isOpen ? 'Open Now' : 'Closed'} tone={tailor.isOpen ? 'success' : 'error'} />
        </View>
      </View>
      <View style={{ padding: spacing.cardInner }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.name} numberOfLines={1}>
            {tailor.shopName}
          </Text>
          <Badge label={tailor.type} tone="navy" withIcon={false} />
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {tailor.name} • {tailor.locality}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 }}>
          <StarRating rating={tailor.rating} reviewCount={tailor.reviewCount} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.sub}>{tailor.distanceKm} km</Text>
          </View>
        </View>
        <View style={styles.chipsRow}>
          {tailor.categories.slice(0, 3).map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Starting at</Text>
            <Text style={styles.price}>₹{tailor.startingPrice}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              label="Profile"
              variant="outline"
              style={{ paddingHorizontal: 12, minHeight: 40 }}
              onPress={() => router.push(`/tailor/${tailor.id}`)}
            />
            <Button
              label="Book Now"
              style={{ paddingHorizontal: 12, minHeight: 40 }}
              onPress={() => router.push(`/booking/${tailor.id}/category`)}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 120 },
  featuredTag: { position: 'absolute', top: 8, left: 8 },
  statusTag: { position: 'absolute', top: 8, right: 8 },
  name: { ...type.cardTitle, fontSize: 15, color: colors.text, flex: 1, marginRight: 6 },
  sub: { ...type.supporting, color: colors.textSecondary },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { backgroundColor: colors.infoBg, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  chipText: { ...type.supporting, fontSize: 11, color: colors.secondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  priceLabel: { ...type.supporting, color: colors.textSecondary },
  price: { ...type.cardTitle, color: colors.primary },
});
