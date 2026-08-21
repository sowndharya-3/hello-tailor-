import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing } from '@/theme';
import { useStore, ME_CUSTOMER } from '@/store/useStore';
import type { Booking } from '@/store/types';
import { computePricing } from './_pricing';

const PAYMENT_METHOD_MAP: Record<string, Booking['paymentMethod']> = {
  UPI: 'UPI',
  Card: 'Card',
  NetBanking: 'Net Banking',
  Wallet: 'Wallet',
};

export default function Processing() {
  const { tailorId, amount, method } = useLocalSearchParams<{ tailorId: string; amount: string; method: string }>();
  const booking = useStore((s) => s.booking);
  const tailors = useStore((s) => s.tailors);
  const measurements = useStore((s) => s.measurements);
  const coupons = useStore((s) => s.coupons);
  const addresses = useStore((s) => s.addresses);
  const createBooking = useStore((s) => s.createBooking);
  const resetBooking = useStore((s) => s.resetBooking);

  useEffect(() => {
    const t = setTimeout(() => {
      // ponytail: mock gateway — fails only if amount ends in a digit chosen to demo the error state on demand
      if (amount === '000') {
        router.replace({ pathname: `/booking/${tailorId}/success`, params: { failed: '1' } } as any);
        return;
      }

      const tailor = tailors.find((t) => t.id === tailorId);
      const pricing = computePricing(booking, tailor, coupons);

      const savedMeasurement = measurements.find((m) => m.id === booking.measurementId);
      const bookingMeasurements = savedMeasurement
        ? [{ garment: booking.category ?? 'Garment', fields: Object.entries(savedMeasurement.fields).map(([label, value]) => ({ label, value })) }]
        : booking.newMeasurement
        ? [{ garment: booking.category ?? 'Garment', fields: Object.entries(booking.newMeasurement).map(([label, value]) => ({ label, value })) }]
        : [];

      const address = booking.addressId ? addresses.find((a) => a.id === booking.addressId) : undefined;
      const location = address
        ? `${address.address}, ${address.city}`
        : `${tailor?.locality ?? tailor?.city ?? ''}, ${tailor?.city ?? ''}`;

      const id = `HT-${Date.now()}`;
      const newBooking: Booking = {
        id,
        customerId: 'me',
        customerName: ME_CUSTOMER.name,
        customerAvatar: ME_CUSTOMER.avatar,
        tailorId: tailorId ?? '',
        tailorName: tailor?.shopName ?? '—',
        category: booking.category ?? '',
        city: tailor?.city ?? '',
        state: tailor?.state ?? '',
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString() : new Date().toISOString(),
        deliveryDate: booking.deliveryDate ? new Date(booking.deliveryDate).toISOString() : new Date().toISOString(),
        amount: pricing.orderAmount,
        advanceAmount: pricing.advance,
        advancePaid: true,
        balancePaid: false,
        discount: pricing.discount,
        tax: pricing.tax,
        deliveryFee: pricing.deliveryFee,
        paymentMethod: PAYMENT_METHOD_MAP[method ?? ''] ?? '—',
        location,
        pickupType: booking.method ?? 'Self Drop',
        status: 'Requested',
        notes: booking.notes,
        measurements: bookingMeasurements,
        designPhotos: booking.designPhotos ?? [],
        requestedAt: new Date().toISOString(),
        history: [{ stage: 'Requested', at: new Date().toISOString() }],
      };

      createBooking(newBooking);
      resetBooking();
      router.replace({ pathname: `/booking/${tailorId}/success`, params: { id } } as any);
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, tailorId, method]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.secondary} />
      <Text style={styles.title}>Processing Payment</Text>
      <Text style={styles.sub}>Please wait while we securely confirm your payment of ₹{amount}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.section },
  title: { ...type.sectionHeading, color: colors.text, marginTop: spacing.lg },
  sub: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
});
