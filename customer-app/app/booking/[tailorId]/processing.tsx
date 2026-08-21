import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing } from '../../../constants/theme';
import ErrorState from '../../../components/ui/ErrorState';

export default function Processing() {
  const { tailorId, amount } = useLocalSearchParams<{ tailorId: string; amount: string }>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      // ponytail: mock gateway — fails only if amount ends in a digit chosen to demo the error state on demand
      if (amount === '000') {
        setFailed(true);
      } else {
        router.replace(`/booking/${tailorId}/success`);
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [amount, tailorId]);

  if (failed) {
    return (
      <View style={styles.wrap}>
        <ErrorState
          icon="close-circle-outline"
          title="Payment Failed"
          message="We couldn't process your payment. No amount was deducted. Please try again."
          ctaLabel="Retry Payment"
          onPress={() => router.back()}
        />
      </View>
    );
  }

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
