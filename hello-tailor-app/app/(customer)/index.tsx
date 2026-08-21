import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { categories } from '@/data/seed';
import { useStore, useCustomerBookings } from '@/store/useStore';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TailorCard from './_components/TailorCard';

export default function Home() {
  const notifications = useStore((s) => s.notifications);
  const tailors = useStore((s) => s.tailors);
  const coupons = useStore((s) => s.coupons);
  const addresses = useStore((s) => s.addresses);
  const customerBookings = useCustomerBookings();

  const unread = notifications.filter((n) => n.audience === 'customer' && !n.read).length;
  const nearby = [...tailors].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  const topRated = [...tailors].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const featured = tailors.filter((t) => t.featured);
  const activeOffers = coupons.filter((c) => c.status === 'Active');
  // ponytail: order-tracking route isn't in this scope's file list; route to the Bookings tab.
  const activeBooking = customerBookings.find((b) => !['Delivered', 'Cancelled', 'Rejected'].includes(b.status));
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
        <Pressable style={styles.locationBtn} onPress={() => {}}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {defaultAddress ? `${defaultAddress.label}, ${defaultAddress.city}` : 'Set your location'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.bell} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          {unread > 0 ? <View style={styles.bellDot} /> : null}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Pressable style={styles.search} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <Text style={styles.searchText}>Search tailors, categories, "blouse"...</Text>
        </Pressable>

        <Pressable style={styles.hero} onPress={() => router.push('/search')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Perfect Fit, Delivered to Your Door</Text>
            <Text style={styles.heroSub}>Book trusted tailors near you in minutes</Text>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Book Now</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} />
            </View>
          </View>
          <Ionicons name="shirt" size={64} color="rgba(255,255,255,0.35)" />
        </Pressable>

        {activeBooking ? (
          <Card style={{ marginHorizontal: spacing.screenH, marginTop: spacing.lg }} onPress={() => router.push('/bookings')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.trackLabel}>Track Your Order</Text>
                <Text style={styles.trackId}>{activeBooking.id}</Text>
              </View>
              <Badge label={activeBooking.status} tone="info" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Ionicons name="chevron-forward-circle-outline" size={18} color={colors.secondary} />
              <Text style={styles.trackCta}>View live tracking</Text>
            </View>
          </Card>
        ) : null}

        <Section title="Categories">
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ paddingHorizontal: spacing.screenH, gap: 16 }}
            renderItem={({ item }) => (
              <Pressable style={styles.catItem} onPress={() => router.push({ pathname: '/category', params: { id: item.id } })}>
                <View style={styles.catCircle}>
                  <Ionicons name={item.icon as any} size={24} color={colors.secondary} />
                </View>
                <Text style={styles.catLabel}>{item.name}</Text>
              </Pressable>
            )}
          />
        </Section>

        <Section title="Nearby Tailors" actionLabel="See All" onAction={() => router.push('/tailors')}>
          <FlatList
            data={nearby}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(t) => t.id}
            contentContainerStyle={{ paddingHorizontal: spacing.screenH }}
            renderItem={({ item }) => <TailorCard tailor={item} />}
          />
        </Section>

        <Section title="Top Rated" actionLabel="See All" onAction={() => router.push('/tailors')}>
          <FlatList
            data={topRated}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(t) => t.id}
            contentContainerStyle={{ paddingHorizontal: spacing.screenH }}
            renderItem={({ item }) => <TailorCard tailor={item} />}
          />
        </Section>

        <Section title="Featured Tailors" actionLabel="See All" onAction={() => router.push('/tailors')}>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(t) => t.id}
            contentContainerStyle={{ paddingHorizontal: spacing.screenH }}
            renderItem={({ item }) => <TailorCard tailor={item} />}
          />
        </Section>

        <Section title="Offers For You" actionLabel="See All" onAction={() => router.push('/profile')}>
          <FlatList
            data={activeOffers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(o) => o.id}
            contentContainerStyle={{ paddingHorizontal: spacing.screenH }}
            renderItem={({ item }) => (
              <Card style={{ width: 260, marginRight: spacing.md, backgroundColor: colors.goldLightBg, borderColor: colors.gold }}>
                <Badge label={item.discountType === 'Percentage' ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`} tone="gold" />
                <Text style={styles.offerTitle}>{item.title}</Text>
                <Text style={styles.offerCode}>Code: {item.code}</Text>
              </Card>
            )}
          />
        </Section>

        <Pressable style={styles.membershipBanner} onPress={() => router.push('/profile')}>
          <Ionicons name="ribbon" size={26} color={colors.gold} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.membershipTitle}>Hello Tailor Gold Membership</Text>
            <Text style={styles.membershipSub}>Free pickup, priority slots & up to 15% off</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.white} />
        </Pressable>

        <Section title="Popular Stitching Categories">
          <View style={{ paddingHorizontal: spacing.screenH, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {categories.slice(3).map((c) => (
              <Pressable key={c.id} style={styles.popularChip} onPress={() => router.push({ pathname: '/category', params: { id: c.id } })}>
                <Text style={styles.popularChipText}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenH,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  logo: { width: 40, height: 40 },
  locationBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text, flexShrink: 1 },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  bellDot: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  search: {
    marginHorizontal: spacing.screenH,
    height: 48,
    borderRadius: radius.search,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchText: { ...type.body, color: colors.textSecondary },
  hero: {
    marginHorizontal: spacing.screenH,
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: { ...type.cardTitle, color: colors.white, fontSize: 18 },
  heroSub: { ...type.supporting, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, marginTop: 12 },
  heroCtaText: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  trackLabel: { ...type.supporting, color: colors.textSecondary },
  trackId: { ...type.cardTitle, fontSize: 15, color: colors.text },
  trackCta: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.secondary, marginLeft: 4 },
  catItem: { alignItems: 'center', gap: 6, width: 64 },
  catCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  catLabel: { ...type.supporting, color: colors.text, textAlign: 'center' },
  offerTitle: { ...type.cardTitle, fontSize: 15, color: colors.text, marginTop: 8 },
  offerCode: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  membershipBanner: {
    marginHorizontal: spacing.screenH,
    marginTop: spacing.section,
    backgroundColor: colors.primary,
    borderRadius: radius.premium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipTitle: { ...type.cardTitle, fontSize: 15, color: colors.white },
  membershipSub: { ...type.supporting, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  popularChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  popularChipText: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text },
});
