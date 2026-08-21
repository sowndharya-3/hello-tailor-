import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { StepProgress } from '@/components/ui/Misc';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { computePricing } from './_pricing';

const METHODS = [
  { id: 'UPI', icon: 'qr-code-outline' },
  { id: 'Card', icon: 'card-outline' },
  { id: 'NetBanking', icon: 'business-outline' },
  { id: 'Wallet', icon: 'wallet-outline' },
] as const;

export default function BookingPayment() {
  const { tailorId } = useLocalSearchParams<{ tailorId: string }>();
  const booking = useStore((s) => s.booking);
  const updateBooking = useStore((s) => s.updateBooking);
  const tailors = useStore((s) => s.tailors);
  const coupons = useStore((s) => s.coupons);
  const tailor = tailors.find((t) => t.id === tailorId) ?? tailors[0];
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('UPI');
  const pricing = computePricing({ ...booking, couponCode: applied ? coupon : undefined }, tailor, coupons);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Advance Payment" subtitle="Secure your booking" />
      <View style={{ paddingHorizontal: spacing.screenH }}>
        <StepProgress step={11} total={11} label="Payment" />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 24 }}>
        <View style={styles.priceCard}>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Order Amount</Text><Text style={styles.priceValue}>₹{pricing.orderAmount}</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery Fee</Text><Text style={styles.priceValue}>{pricing.deliveryFee ? `₹${pricing.deliveryFee}` : 'Free'}</Text></View>
          {pricing.discount ? <View style={styles.priceRow}><Text style={[styles.priceLabel, { color: colors.success }]}>Discount</Text><Text style={[styles.priceValue, { color: colors.success }]}>-₹{pricing.discount}</Text></View> : null}
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Tax</Text><Text style={styles.priceValue}>₹{pricing.tax}</Text></View>
          <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Final Payable</Text><Text style={styles.totalValue}>₹{pricing.total}</Text></View>
        </View>

        <Text style={styles.label}>Have a coupon code?</Text>
        <View style={styles.couponRow}>
          <TextInput
            value={coupon}
            onChangeText={(v) => { setCoupon(v.toUpperCase()); setApplied(false); }}
            placeholder="Enter coupon code"
            placeholderTextColor={colors.disabledText}
            autoCapitalize="characters"
            style={styles.couponInput}
          />
          <Pressable style={styles.couponBtn} onPress={() => setApplied(!!coupon)}>
            <Text style={styles.couponBtnText}>{applied ? 'Applied' : 'Apply'}</Text>
          </Pressable>
        </View>
        {applied ? (
          pricing.discount ? (
            <Text style={styles.appliedText}>Coupon "{coupon}" applied — you saved ₹{pricing.discount}</Text>
          ) : (
            <Text style={styles.errorText}>Coupon "{coupon}" isn't valid for this order</Text>
          )
        ) : null}

        <View style={styles.advanceCard}>
          <Text style={styles.advanceNow}>Pay Now (Advance)</Text>
          <Text style={styles.advanceAmount}>₹{pricing.advance}</Text>
          <Text style={styles.advanceRest}>Remaining ₹{pricing.balance} payable on delivery</Text>
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={{ gap: 10 }}>
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <Pressable key={m.id} style={[styles.methodRow, active && styles.methodRowActive]} onPress={() => setMethod(m.id)}>
                <Ionicons name={m.icon as any} size={20} color={colors.secondary} />
                <Text style={styles.methodText}>{m.id}</Text>
                <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.secondary} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label={`Pay ₹${pricing.advance} & Confirm Booking`}
          onPress={() => {
            updateBooking({ couponCode: applied && pricing.discount ? coupon : undefined });
            router.push({ pathname: `/booking/${tailorId}/processing`, params: { method: String(method), amount: String(pricing.advance) } } as any);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  footer: { paddingHorizontal: spacing.screenH, paddingTop: spacing.md, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  priceCard: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.lg },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  priceLabel: { ...type.body, color: colors.textSecondary },
  priceValue: { ...type.body, color: colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 4 },
  totalLabel: { ...type.cardTitle, fontSize: 15, color: colors.text },
  totalValue: { ...type.cardTitle, fontSize: 15, color: colors.primary },
  label: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 8, marginTop: spacing.md },
  couponRow: { flexDirection: 'row', gap: 8 },
  couponInput: { flex: 1, height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, paddingHorizontal: 14, ...type.body, color: colors.text, backgroundColor: colors.white },
  couponBtn: { paddingHorizontal: 18, borderRadius: radius.input, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  couponBtnText: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.white },
  appliedText: { ...type.supporting, color: colors.success, marginTop: 6 },
  errorText: { ...type.supporting, color: colors.error, marginTop: 6 },
  advanceCard: { alignItems: 'center', backgroundColor: colors.goldLightBg, borderRadius: radius.card, padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  advanceNow: { ...type.supporting, color: colors.gold },
  advanceAmount: { ...type.price, color: colors.gold, marginTop: 4 },
  advanceRest: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1.5, borderColor: colors.border, padding: spacing.cardInner },
  methodRowActive: { borderColor: colors.secondary, backgroundColor: colors.infoBg },
  methodText: { flex: 1, ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
});
